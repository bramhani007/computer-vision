type Props = {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
};

export default function ConfidenceScore({ confidence, size = 'md' }: Props) {
  const pct = Math.max(0, Math.min(100, confidence));
  const tone =
    pct >= 85 ? { text: 'text-emerald-600', bar: 'bg-emerald-500', label: 'High confidence' } :
    pct >= 60 ? { text: 'text-teal-600', bar: 'bg-teal-500', label: 'Moderate confidence' } :
    { text: 'text-amber-600', bar: 'bg-amber-500', label: 'Low confidence' };

  const dims = size === 'lg' ? 'h-3.5' : size === 'sm' ? 'h-2' : 'h-2.5';
  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl';

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between">
        <span className={`font-display font-700 ${textSize} ${tone.text}`}>{pct.toFixed(2)}%</span>
        <span className="text-xs font-medium text-forest-500">{tone.label}</span>
      </div>
      <div className={`mt-2 w-full overflow-hidden rounded-full bg-forest-100 ${dims}`}>
        <div
          className={`${dims} rounded-full ${tone.bar} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
