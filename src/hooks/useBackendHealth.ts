import { useEffect, useState, useCallback } from 'react';
import { checkHealth, HealthStatus } from '@/services/api';

export function useBackendHealth(pollMs = 30000) {
  const [status, setStatus] = useState<HealthStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setStatus('checking');
    const ok = await checkHealth();
    setStatus(ok ? 'connected' : 'offline');
    setLastChecked(new Date());
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, pollMs);
    return () => clearInterval(t);
  }, [refresh, pollMs]);

  return { status, lastChecked, refresh };
}
