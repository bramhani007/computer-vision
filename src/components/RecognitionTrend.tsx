import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart,
} from 'recharts';
import type { Statistics } from '@/services/api';

export default function RecognitionTrend({ data, loading }: { data: Statistics['recognition_trend']; loading?: boolean }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-forest-700">Recognition Trend</h3>
      <p className="mt-0.5 text-xs text-forest-500">Date versus number of predictions</p>
      <div className="mt-5 h-72">
        {loading ? (
          <div className="shimmer-bg h-full w-full animate-shimmer rounded-xl" />
        ) : data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-forest-400">No predictions yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#28a39f" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#28a39f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f1e4" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#245b35' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#245b35' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0f1e4', fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="none" fill="url(#trendFill)" />
              <Line type="monotone" dataKey="count" stroke="#2c7240" strokeWidth={2.5} dot={{ r: 3, fill: '#2c7240' }} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
