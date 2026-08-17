import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { Statistics } from '@/services/api';

const COLORS = ['#2c7240', '#28a39f', '#5fae74', '#46bfb9', '#3c8f53', '#7dd9d3', '#94cea3', '#1d8380'];

export default function SpeciesChart({ data, loading }: { data: Statistics['species_distribution']; loading?: boolean }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-forest-700">Species Distribution</h3>
      <p className="mt-0.5 text-xs text-forest-500">Species versus number of predictions</p>
      <div className="mt-5 h-72">
        {loading ? (
          <div className="shimmer-bg h-full w-full animate-shimmer rounded-xl" />
        ) : data.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f1e4" vertical={false} />
              <XAxis dataKey="species" tick={{ fontSize: 12, fill: '#245b35' }} interval={0} angle={-20} textAnchor="end" height={64} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#245b35' }} />
              <Tooltip
                cursor={{ fill: 'rgba(60, 143, 83, 0.06)' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #e0f1e4', fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="grid h-full place-items-center text-sm text-forest-400">
      No predictions yet.
    </div>
  );
}
