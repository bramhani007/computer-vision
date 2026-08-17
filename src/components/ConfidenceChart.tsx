import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { Statistics } from '@/services/api';

const COLORS = ['#2c7240', '#28a39f', '#5fae74', '#46bfb9', '#3c8f53', '#7dd9d3', '#94cea3', '#1d8380'];

export default function ConfidenceChart({ data, loading }: { data: Statistics['species_percentage']; loading?: boolean }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-forest-700">Species Recognition Percentage</h3>
      <p className="mt-0.5 text-xs text-forest-500">Percentage of predictions for each species</p>
      <div className="mt-5 h-72">
        {loading ? (
          <div className="shimmer-bg h-full w-full animate-shimmer rounded-xl" />
        ) : data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-forest-400">No predictions yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="species"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => `${v.toFixed(1)}%`}
                contentStyle={{ borderRadius: 12, border: '1px solid #e0f1e4', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
