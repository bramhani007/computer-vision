import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, X, Eye, Calendar, Clock, ArrowRight } from 'lucide-react';
import PredictionTable from '@/components/PredictionTable';
import ConfidenceScore from '@/components/ConfidenceScore';
import SpeciesInfo from '@/components/SpeciesInfo';
import { getPredictions, deletePrediction, friendlyError, type Prediction } from '@/services/api';

export default function History() {
  const [items, setItems] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Prediction | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPredictions();
      setItems(data);
    } catch (err) {
      setError(friendlyError(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const speciesOptions = useMemo(
    () => Array.from(new Set(items.map((i) => i.species))).sort(),
    [items]
  );

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== 'all') list = list.filter((i) => i.species === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => i.species.toLowerCase().includes(q) || i.image_name?.toLowerCase().includes(q));
    }
    return list;
  }, [items, filter, query]);

  const onDelete = async (id: number) => {
    if (!confirm('Delete this recognition record?')) return;
    try {
      await deletePrediction(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelected((prev) => (prev?.id === id ? null : prev));
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  const resolveImage = (p: Prediction) => p.image_url || null;

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="section-eyebrow">History</span>
        <h1 className="mt-2 font-display text-3xl font-700 text-forest-900 sm:text-4xl">Recognition History</h1>
        <p className="mt-3 text-forest-600">View your previous animal recognition results.</p>
      </div>

      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search species…"
              className="w-full rounded-xl border-0 bg-forest-50 py-2.5 pl-9 pr-3 text-sm text-forest-800 ring-1 ring-forest-100 placeholder:text-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-forest-500">Filter</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl bg-forest-50 px-3 py-2.5 text-sm font-600 text-forest-700 ring-1 ring-forest-100 focus:outline-none focus:ring-2 focus:ring-forest-400"
            >
              <option value="all">All species</option>
              {speciesOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <PredictionTable
            predictions={filtered}
            loading={loading}
            empty={!loading && filtered.length === 0}
            onDelete={onDelete}
            onView={setSelected}
            resolveImage={resolveImage}
          />
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-forest-950/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)} />
          <aside className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between border-b border-forest-100 px-5 py-4">
              <h2 className="font-display text-lg font-700 text-forest-900">Prediction Details</h2>
              <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-lg text-forest-600 ring-1 ring-forest-100 hover:bg-forest-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-5">
              <div className="overflow-hidden rounded-2xl bg-forest-50 ring-1 ring-forest-100">
                {resolveImage(selected) ? (
                  <img src={resolveImage(selected)!} alt={selected.species} className="mx-auto max-h-56 w-auto object-contain" />
                ) : (
                  <div className="grid h-40 place-items-center text-forest-300">No image</div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Predicted Species</p>
                <p className="mt-0.5 font-display text-2xl font-700 text-forest-900">{selected.species}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Confidence Score</p>
                <div className="mt-1"><ConfidenceScore confidence={selected.confidence} size="lg" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-forest-50 px-3 py-2.5 ring-1 ring-forest-100">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest-400"><Calendar className="h-3.5 w-3.5" /> Date</p>
                  <p className="mt-0.5 text-sm font-600 text-forest-800">{selected.created_at ? new Date(selected.created_at).toLocaleDateString() : '—'}</p>
                </div>
                <div className="rounded-xl bg-forest-50 px-3 py-2.5 ring-1 ring-forest-100">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest-400"><Clock className="h-3.5 w-3.5" /> Time</p>
                  <p className="mt-0.5 text-sm font-600 text-forest-800">{selected.created_at ? new Date(selected.created_at).toLocaleTimeString() : '—'}</p>
                </div>
              </div>
              <SpeciesInfo
                species={selected.species}
                habitat={habitatFor(selected.species)}
                description={descriptionFor(selected.species)}
              />
              {selected.id != null && (
                <button onClick={() => onDelete(selected.id)} className="btn w-full bg-red-50 text-red-600 ring-1 ring-red-100 hover:bg-red-100">
                  <Trash2 className="h-4 w-4" /> Delete this record
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

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
  };
  return map[s] ?? 'Varies by species; see wildlife references for details.';
}

function descriptionFor(species: string): string {
  const s = species.toLowerCase();
  const map: Record<string, string> = {
    tiger: 'The largest living cat species, recognizable by dark vertical stripes on orange-brown fur. A solitary apex predator native to Asia.',
    lion: 'A large social cat that lives in prides. Males are known for their distinctive manes.',
    elephant: 'The largest living land animal, with a long flexible trunk and ivory tusks. Highly intelligent and social.',
    zebra: 'An African equine with distinctive black-and-white striped coats, unique to each individual.',
    giraffe: 'The tallest living terrestrial animal, with an exceptionally long neck and legs, native to Africa.',
    bear: 'A large, powerful mammal with a varied diet. Several species exist across the Northern Hemisphere.',
    panda: 'A bear native to south central China, almost entirely feeding on bamboo and known for its black-and-white coat.',
    fox: 'A small-to-medium omnivorous mammal with a pointed snout and bushy tail, found across many habitats.',
    deer: 'Ruminant mammals with antlers (in males of most species), found in forests and open country.',
    wolf: 'A large canine and social predator that lives and hunts in packs.',
  };
  return map[s] ?? `${species} is an animal species recognized by the MobileNet v2 model from the uploaded image.`;
}
