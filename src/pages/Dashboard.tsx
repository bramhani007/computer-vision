import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Layers, Gauge, Trophy, ArrowRight, Calendar, Clock } from 'lucide-react';
import StatisticsCard from '@/components/StatisticsCard';
import SpeciesChart from '@/components/SpeciesChart';
import ConfidenceChart from '@/components/ConfidenceChart';
import RecognitionTrend from '@/components/RecognitionTrend';
import { getStatistics, getPredictions, friendlyError, type Statistics, type Prediction } from '@/services/api';

const emptyStats: Statistics = {
  total_predictions: 0,
  unique_species: 0,
  average_confidence: 0,
  most_recognized_species: null,
  species_distribution: [],
  species_percentage: [],
  recognition_trend: [],
};

export default function Dashboard() {
  const [stats, setStats] = useState<Statistics>(emptyStats);
  const [recent, setRecent] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, r] = await Promise.all([getStatistics(), getPredictions()]);
      setStats(s);
      setRecent(r.slice(0, 5));
    } catch (err) {
      setError(friendlyError(err));
      setStats(emptyStats);
      setRecent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="section-eyebrow">Dashboard</span>
        <h1 className="mt-2 font-display text-3xl font-700 text-forest-900 sm:text-4xl">Wildlife Monitoring Dashboard</h1>
        <p className="mt-3 text-forest-600">Monitor animal species recognition results and statistics.</p>
      </div>

      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard title="Total Predictions" description="Actual total from the backend" value={stats.total_predictions} Icon={BarChart3} tone="forest" loading={loading} />
        <StatisticsCard title="Unique Species" description="Different recognized species" value={stats.unique_species} Icon={Layers} tone="teal" loading={loading} />
        <StatisticsCard title="Average Confidence" description="Actual average confidence" value={`${stats.average_confidence.toFixed(2)}%`} Icon={Gauge} tone="amber" loading={loading} />
        <StatisticsCard title="Most Recognized" description="Species with the most predictions" value={stats.most_recognized_species ?? '—'} Icon={Trophy} tone="sky" loading={loading} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SpeciesChart data={stats.species_distribution} loading={loading} />
        <ConfidenceChart data={stats.species_percentage} loading={loading} />
      </div>
      <div className="mt-6">
        <RecognitionTrend data={stats.recognition_trend} loading={loading} />
      </div>

      {/* Recent predictions */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-700 text-forest-900">Recent Predictions</h2>
          <Link to="/history" className="btn-ghost text-sm">
            View All History <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="card space-y-3 p-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="shimmer-bg h-14 w-full animate-shimmer rounded-lg" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="card grid place-items-center px-6 py-12 text-center text-sm text-forest-500">
              No predictions yet. Upload an animal image to see recent results here.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((p) => {
                const dt = p.created_at ? new Date(p.created_at) : null;
                const img = p.image_url || null;
                return (
                  <div key={p.id} className="card flex items-center gap-4 p-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-forest-50 ring-1 ring-forest-100">
                      {img ? (
                        <img src={img} alt={p.species} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-forest-300 text-[10px]">N/A</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-700 text-forest-900">{p.species}</p>
                      <p className="text-xs text-teal-600 font-600">{p.confidence.toFixed(2)}%</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-forest-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {dt ? dt.toLocaleDateString() : '—'}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {dt ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
