import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanSearch, Loader2, AlertCircle, BrainCircuit, ArrowRight } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import PredictionCard from '@/components/PredictionCard';
import SpeciesInfo from '@/components/SpeciesInfo';
import BackendStatus from '@/components/BackendStatus';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { predictImage, friendlyError, type Prediction } from '@/services/api';

export default function Recognize() {
  const navigate = useNavigate();
  const { status } = useBackendHealth();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Our AI model is analyzing the uploaded image.');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Prediction | null>(null);

  const onImageChange = (file: File | null) => {
    setImage(file);
    setResult(null);
    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const analyze = async () => {
    if (!image) {
      setError('Please select an animal image first.');
      return;
    }
    setLoading(true);
    setLoadingMsg('Loading the AI model for the first time… this may take a moment.');
    setError(null);
    setResult(null);
    try {
      const res = await predictImage(image);
      setResult(res);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="section-eyebrow">Recognize</span>
        <h1 className="mt-2 font-display text-3xl font-700 text-forest-900 sm:text-4xl">Recognize Animal Species</h1>
        <p className="mt-3 text-forest-600">Upload an animal image to identify its species.</p>
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <BackendStatus status={status} />
      </div>

      {error && (
        <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-3xl space-y-6">
        {!result && (
          <>
            <ImageUploader image={image} previewUrl={preview} onImageChange={onImageChange} disabled={loading} />

            <div className="flex justify-center">
              <button onClick={analyze} disabled={loading || !image} className="btn-primary px-7 py-3 text-base">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-5 w-5" /> Analyze Animal
                  </>
                )}
              </button>
            </div>

            {loading && (
              <div className="card flex flex-col items-center gap-3 px-6 py-10 text-center">
                <span className="relative grid h-16 w-16 place-items-center">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-teal-400" />
                  <span className="relative grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-600">
                    <BrainCircuit className="h-8 w-8" />
                  </span>
                </span>
                <p className="font-display text-lg font-700 text-forest-800">Analyzing Image…</p>
                <p className="text-sm text-forest-500">{loadingMsg}</p>
              </div>
            )}
          </>
        )}

        {result && (
          <div className="space-y-6">
            <PredictionCard prediction={result} imageUrl={preview} onReset={reset} />
            <SpeciesInfo
              species={result.species}
              habitat={habitatFor(result.species)}
              description={descriptionFor(result.species)}
            />
            <div className="flex justify-center gap-3">
              <button onClick={reset} className="btn-secondary">
                Analyze Another Image
              </button>
              <button onClick={() => navigate('/history')} className="btn-ghost">
                View History <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Short, factual species info. The backend returns the predicted species name;
// we surface a concise reference for the most common species. For species not
// listed here, a generic but honest description is shown (no fabricated facts).
function habitatFor(species: string): string {
  const s = species.toLowerCase();
  const map: Record<string, string> = {
    tiger: 'Forests and grasslands of South and East Asia.',
    lion: 'Savannas and open woodlands of sub-Saharan Africa.',
    elephant: 'Savannas, forests and grasslands of Africa and South Asia.',
    zebra: 'Open plains and savannas of Africa.',
    giraffe: 'Savannas and open woodlands of Africa.',
    bear: 'Forests, mountains and tundra across the Northern Hemisphere.',
    panda: 'Temperate bamboo forests of central China.',
    fox: 'Forests, grasslands and urban edges worldwide.',
    deer: 'Forests, meadows and woodlands across many regions.',
    wolf: 'Forests, tundra and mountains of the Northern Hemisphere.',
    horse: 'Plains and grasslands; domesticated worldwide.',
    cow: 'Pastures and farmland; domesticated worldwide.',
    sheep: 'Hill pastures and farmland; domesticated worldwide.',
    goat: 'Rocky hillsides and pastures; domesticated worldwide.',
    chicken: 'Farmland and domestic settings worldwide.',
    monkey: 'Tropical and subtropical forests worldwide.',
    kangaroo: 'Open plains and arid regions of Australia.',
    rhinoceros: 'Savannas and floodplains of Africa and South Asia.',
    hippopotamus: 'Rivers and lakes of sub-Saharan Africa.',
    leopard: 'Forests, savannas and mountains across Africa and Asia.',
    cheetah: 'Open savannas and semi-arid regions of Africa.',
  };
  return map[s] ?? 'Varies by species; see wildlife references for details.';
}

function descriptionFor(species: string): string {
  const s = species.toLowerCase();
  const map: Record<string, string> = {
    tiger: 'The largest living cat species, recognizable by its dark vertical stripes on orange-brown fur. A solitary apex predator native to Asia.',
    lion: 'A large social cat that lives in groups called prides. Males are known for their distinctive manes.',
    elephant: 'The largest living land animal, with a long flexible trunk and ivory tusks. Highly intelligent and social.',
    zebra: 'An African equine with distinctive black-and-white striped coats, unique to each individual.',
    giraffe: 'The tallest living terrestrial animal, with an exceptionally long neck and legs, native to Africa.',
    bear: 'A large, powerful mammal with a varied diet. Several species exist across the Northern Hemisphere.',
    panda: 'A bear native to south central China, almost entirely feeding on bamboo and known for its black-and-white coat.',
    fox: 'A small-to-medium omnivorous mammal with a pointed snout and bushy tail, found across many habitats.',
    deer: 'Ruminant mammals with antlers (in males of most species), found in forests and open country.',
    wolf: 'A large canine and social predator that lives and hunts in packs.',
    horse: 'A large domesticated mammal long used for riding, work and sport.',
    cow: 'A domesticated bovine raised for milk, meat and labor across the world.',
    sheep: 'A domesticated ruminant raised for wool, milk and meat.',
    goat: 'A hardy domesticated ruminant that thrives in varied climates and terrain.',
    chicken: 'One of the most common domesticated birds, raised worldwide for eggs and meat.',
    monkey: 'Primates that typically have tails and live in social groups, mostly in tropical regions.',
    kangaroo: 'Marsupials native to Australia, known for powerful hind legs and hopping locomotion.',
    rhinoceros: 'Large herbivores with one or two keratin horns, native to Africa and South Asia.',
    hippopotamus: 'A large semi-aquatic mammal of Africa, spending much of its day in water.',
    leopard: 'A solitary big cat with a spotted coat, highly adaptable across Africa and Asia.',
    cheetah: 'The fastest land animal, built for speed with a slender body and spotted coat.',
  };
  return map[s] ?? `${species} is an animal species recognized by the MobileNet v2 model from the uploaded image.`;
}
