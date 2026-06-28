import { useCallback, useRef, useState } from 'react';
import { runSpeedTest } from '../services/speedTest';
import type { TestPhase, TestState } from '../types';

const initial: TestState = {
  phase: 'idle',
  ping: 0,
  jitter: 0,
  download: 0,
  upload: 0,
  ip: '',
  isp: '',
  server: '',
  progress: 0,
};

export function useSpeedTest() {
  const [state, setState] = useState<TestState>(initial);
  const abortRef = useRef<(() => void) | null>(null);

  const start = useCallback((serverId: string) => {
    if (state.phase !== 'idle' && state.phase !== 'complete') return;
    setState({ ...initial, phase: 'finding-server' });

    const { abort } = runSpeedTest(serverId, {
      onPhaseChange: (phase: TestPhase) =>
        setState((prev) => ({ ...prev, phase, progress: 0 })),
      onPingUpdate: (ping, jitter) =>
        setState((prev) => ({ ...prev, ping, jitter })),
      onDownloadUpdate: (download, progress) =>
        setState((prev) => ({ ...prev, download, progress })),
      onUploadUpdate: (upload, progress) =>
        setState((prev) => ({ ...prev, upload, progress })),
      onComplete: (result) =>
        setState((prev) => ({ ...prev, ...result, phase: 'complete', progress: 1 })),
      onError: (_msg) =>
        setState((prev) => ({ ...prev, phase: 'idle' })),
    });

    abortRef.current = abort;
  }, [state.phase]);

  const stop = useCallback(() => {
    abortRef.current?.();
    setState(initial);
  }, []);

  const reset = useCallback(() => setState(initial), []);

  return { state, start, stop, reset };
}
