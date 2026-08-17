import { Link } from 'react-router-dom';
import { Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';
import { HealthStatus } from '@/services/api';

type Props = {
  status: HealthStatus;
  lastChecked?: Date | null;
  onRefresh?: () => void;
  compact?: boolean;
};

export default function BackendStatus({ status, lastChecked, onRefresh, compact }: Props) {
  const map = {
    connected: {
      label: 'AI Connected',
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-200 bg-emerald-50 text-emerald-700',
      Icon: Wifi,
    },
    offline: {
      label: 'Connection Error',
      dot: 'bg-red-500',
      ring: 'ring-red-200 bg-red-50 text-red-700',
      Icon: WifiOff,
    },
    checking: {
      label: 'Checking…',
      dot: 'bg-amber-400',
      ring: 'ring-amber-200 bg-amber-50 text-amber-700',
      Icon: Loader2,
    },
  }[status];

  if (compact) {
    return (
      <span className={`chip ring-1 ${map.ring}`}>
        <span className={`relative flex h-2 w-2`}>
          {status === 'connected' && (
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${map.dot}`} />
        </span>
        {map.label}
      </span>
    );
  }

  const Icon = map.Icon;
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 ${map.ring}`}>
      <span className="relative flex h-2.5 w-2.5">
        {status === 'connected' && (
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${map.dot}`} />
      </span>
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <Icon className={`h-4 w-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
          {map.label}
        </p>
        {lastChecked && (
          <p className="text-xs opacity-70">
            Checked {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="rounded-lg p-1.5 text-current opacity-70 transition hover:bg-white/60 hover:opacity-100"
          aria-label="Refresh connection"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function OfflineBanner({ status }: { status: HealthStatus }) {
  if (status !== 'offline') return null;
  return (
    <Link
      to="/recognize"
      className="fixed bottom-4 right-4 z-40 max-w-sm rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-red-400 transition hover:bg-red-700"
    >
      <p className="flex items-center gap-2 font-semibold">
        <WifiOff className="h-4 w-4" />
        Connection error
      </p>
      <p className="mt-0.5 text-xs text-red-100">
        Unable to reach the database. Please check your connection and try again.
      </p>
    </Link>
  );
}
