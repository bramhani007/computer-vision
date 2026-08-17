import { Calendar, Clock, PawPrint, Sparkles } from 'lucide-react';
import ConfidenceScore from './ConfidenceScore';
import type { Prediction } from '@/services/api';

type Props = {
  prediction: Prediction;
  imageUrl?: string | null;
  onReset?: () => void;
};

export default function PredictionCard({ prediction, imageUrl, onReset }: Props) {
  const dt = prediction.created_at ? new Date(prediction.created_at) : null;
  const date = dt ? dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
  const time = dt ? dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="card animate-scale-in overflow-hidden">
      <div className="flex items-center gap-2 border-b border-forest-100 bg-gradient-to-r from-forest-600 to-teal-600 px-5 py-3 text-white">
        <Sparkles className="h-4 w-4" />
        <h3 className="text-sm font-bold uppercase tracking-wide">Recognition Result</h3>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-forest-50 ring-1 ring-forest-100">
          {imageUrl ? (
            <img src={imageUrl} alt="Analyzed" className="mx-auto max-h-64 w-auto object-contain" />
          ) : (
            <div className="grid h-48 place-items-center text-forest-300">
              <PawPrint className="h-12 w-12" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Predicted Species</p>
            <p className="mt-0.5 font-display text-2xl font-700 text-forest-900">{prediction.species}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Confidence Score</p>
            <div className="mt-1">
              <ConfidenceScore confidence={prediction.confidence} size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-forest-50 px-3 py-2.5 ring-1 ring-forest-100">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest-400">
                <Calendar className="h-3.5 w-3.5" /> Date
              </p>
              <p className="mt-0.5 text-sm font-600 text-forest-800">{date}</p>
            </div>
            <div className="rounded-xl bg-forest-50 px-3 py-2.5 ring-1 ring-forest-100">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest-400">
                <Clock className="h-3.5 w-3.5" /> Time
              </p>
              <p className="mt-0.5 text-sm font-600 text-forest-800">{time}</p>
            </div>
          </div>

          {onReset && (
            <button onClick={onReset} className="btn-secondary w-full">
              Analyze Another Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
