import { Trash2, Eye, Calendar, Clock } from 'lucide-react';
import type { Prediction } from '@/services/api';

type Props = {
  predictions: Prediction[];
  loading?: boolean;
  empty?: boolean;
  onDelete?: (id: number) => void;
  onView?: (p: Prediction) => void;
  resolveImage?: (p: Prediction) => string | null;
};

export default function PredictionTable({ predictions, loading, empty, onDelete, onView, resolveImage }: Props) {
  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="space-y-2 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer-bg h-12 w-full animate-shimmer rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (empty || predictions.length === 0) {
    return (
      <div className="card grid place-items-center px-6 py-16 text-center">
        <p className="font-display text-lg font-700 text-forest-800">No Recognition History</p>
        <p className="mt-1 text-sm text-forest-500">Upload an animal image to create your first recognition record.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-forest-100 bg-forest-50/60 text-left text-xs font-semibold uppercase tracking-wide text-forest-500">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Species</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {predictions.map((p) => {
              const dt = p.created_at ? new Date(p.created_at) : null;
              const img = resolveImage ? resolveImage(p) : p.image_url || null;
              return (
                <tr key={p.id} className="group transition hover:bg-forest-50/50">
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-forest-50 ring-1 ring-forest-100">
                      {img ? (
                        <img src={img} alt={p.species} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-forest-300 text-[10px]">N/A</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-600 text-forest-800">{p.species}</td>
                  <td className="px-4 py-3">
                    <span className="chip bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                      {p.confidence.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-forest-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-forest-400" />
                      {dt ? dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-forest-600">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-forest-400" />
                      {dt ? dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {onView && (
                        <button
                          onClick={() => onView(p)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-forest-600 ring-1 ring-forest-100 transition hover:bg-forest-100"
                          aria-label="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && p.id != null && (
                        <button
                          onClick={() => onDelete(p.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-red-500 ring-1 ring-red-100 transition hover:bg-red-50"
                          aria-label="Delete prediction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
