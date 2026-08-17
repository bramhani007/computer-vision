import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  value: ReactNode;
  Icon: LucideIcon;
  tone?: 'forest' | 'teal' | 'amber' | 'sky';
  loading?: boolean;
};

const tones = {
  forest: 'bg-forest-100 text-forest-700',
  teal: 'bg-teal-100 text-teal-700',
  amber: 'bg-amber-100 text-amber-700',
  sky: 'bg-sky-100 text-sky-700',
};

export default function StatisticsCard({ title, description, value, Icon, tone = 'forest', loading }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">{title}</p>
          <p className="mt-0.5 text-xs text-forest-500">{description}</p>
        </div>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="shimmer-bg h-8 w-24 animate-shimmer rounded-lg" />
        ) : (
          <p className="font-display text-3xl font-700 text-forest-900">{value}</p>
        )}
      </div>
    </div>
  );
}
