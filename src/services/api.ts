import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isBackendConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export type Prediction = {
  id?: number;
  image_name: string;
  image_path?: string;
  image_url?: string;
  species: string;
  confidence: number;
  created_at?: string;
};

export type Statistics = {
  total_predictions: number;
  unique_species: number;
  average_confidence: number;
  most_recognized_species: string | null;
  species_distribution: { species: string; count: number }[];
  species_percentage: { species: string; percentage: number }[];
  recognition_trend: { date: string; count: number }[];
};

export type HealthStatus = 'connected' | 'offline' | 'checking';

// ---- TensorFlow.js MobileNet (lazy-loaded, real ML inference) ----
let mobilenetModel: Awaited<ReturnType<typeof loadMobilenet>> | null = null;
let modelLoading: Promise<Awaited<ReturnType<typeof loadMobilenet>>> | null = null;

async function loadMobilenet() {
  const tf = await import('@tensorflow/tfjs');
  await tf.ready();
  const mobilenet = await import('@tensorflow-models/mobilenet');
  return mobilenet.load({ version: 2, alpha: 1.0 });
}

async function getMobilenet() {
  if (mobilenetModel) return mobilenetModel;
  if (!modelLoading) modelLoading = loadMobilenet();
  mobilenetModel = await modelLoading;
  return mobilenetModel;
}

// ---- Health check: verify Supabase is reachable ----
export async function checkHealth(): Promise<boolean> {
  if (!isBackendConfigured) return false;
  try {
    const { error } = await supabase.from('predictions').select('id').limit(1).maybeSingle();
    return !error;
  } catch {
    return false;
  }
}

// ---- Prediction: run MobileNet in-browser, store result in Supabase ----
export async function predictImage(file: File): Promise<Prediction> {
  const model = await getMobilenet();

  const imgEl = await fileToImageElement(file);
  const rawPredictions = await model.classify(imgEl, 5);

  if (!rawPredictions || rawPredictions.length === 0) {
    throw new Error('Unable to recognize the image. Please try again.');
  }

  const top = rawPredictions[0];
  const species = top.className.split(',')[0].trim();
  const confidence = Math.round(top.probability * 10000) / 100;

  // Upload image to Supabase Storage
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('predictions')
    .upload(fileName, file, { contentType: file.type });

  let imagePath = '';
  if (!uploadError) {
    imagePath = supabase.storage.from('predictions').getPublicUrl(fileName).data.publicUrl;
  }

  // Store prediction in Supabase database
  const { data, error } = await supabase
    .from('predictions')
    .insert({
      image_name: file.name,
      image_path: imagePath,
      species,
      confidence,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    image_name: data.image_name,
    image_path: data.image_path,
    image_url: data.image_path,
    species: data.species,
    confidence: data.confidence,
    created_at: data.created_at,
  };
}

// ---- History: list all predictions ----
export async function getPredictions(): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;

  return (data || []).map((r) => ({
    id: r.id,
    image_name: r.image_name,
    image_path: r.image_path,
    image_url: r.image_path,
    species: r.species,
    confidence: r.confidence,
    created_at: r.created_at,
  }));
}

// ---- Get single prediction ----
export async function getPredictionById(id: number): Promise<Prediction> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Prediction not found.');

  return {
    id: data.id,
    image_name: data.image_name,
    image_path: data.image_path,
    image_url: data.image_path,
    species: data.species,
    confidence: data.confidence,
    created_at: data.created_at,
  };
}

// ---- Statistics: computed from real prediction data ----
export async function getStatistics(): Promise<Statistics> {
  const { data, error } = await supabase
    .from('predictions')
    .select('species, confidence, created_at');

  if (error) throw error;

  const rows = data || [];
  const total = rows.length;
  const speciesCounts: Record<string, number> = {};
  const confidences: number[] = [];
  const trend: Record<string, number> = {};

  for (const r of rows) {
    speciesCounts[r.species] = (speciesCounts[r.species] || 0) + 1;
    confidences.push(r.confidence);
    const day = (r.created_at || '').slice(0, 10);
    if (day) trend[day] = (trend[day] || 0) + 1;
  }

  const uniqueSpecies = Object.keys(speciesCounts).length;
  const avgConf = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;
  const mostRecognized = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const distribution = Object.entries(speciesCounts)
    .map(([species, count]) => ({ species, count }))
    .sort((a, b) => b.count - a.count);

  const percentage = distribution.map((d) => ({
    species: d.species,
    percentage: total ? Math.round((d.count / total) * 10000) / 100 : 0,
  }));

  const trendList = Object.entries(trend)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total_predictions: total,
    unique_species: uniqueSpecies,
    average_confidence: Math.round(avgConf * 100) / 100,
    most_recognized_species: mostRecognized,
    species_distribution: distribution,
    species_percentage: percentage,
    recognition_trend: trendList,
  };
}

// ---- Delete prediction ----
export async function deletePrediction(id: number): Promise<void> {
  const { error } = await supabase.from('predictions').delete().eq('id', id);
  if (error) throw error;
}

// ---- Friendly error messages ----
export function friendlyError(err: unknown): string {
  if (!isBackendConfigured) {
    return 'Database is not configured. Please check your connection settings.';
  }
  if (err instanceof Error) {
    if (err.message.includes('Failed to fetch') || err.message.includes('network')) {
      return 'Unable to connect to the database. Please try again later.';
    }
    return err.message || 'Unable to recognize the image. Please try again.';
  }
  return 'Unable to recognize the image. Please try again.';
}

// ---- Helper: convert File to HTMLImageElement for TF.js ----
function fileToImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Invalid image: could not load for analysis.'));
    };
    img.src = url;
  });
}
