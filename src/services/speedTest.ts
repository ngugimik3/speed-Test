/**
 * Speed test service using browser-native fetch to measure real network performance.
 * Uses multiple CDN endpoints for accurate measurement without third-party backends.
 */

import type { Server, TestState } from '../types';

export const SERVERS: Server[] = [
  { id: 'cf-auto', name: 'Cloudflare', location: 'Auto (Nearest)', url: 'https://speed.cloudflare.com' },
  { id: 'cf-us', name: 'Cloudflare US', location: 'San Jose, CA', url: 'https://speed.cloudflare.com' },
  { id: 'cf-eu', name: 'Cloudflare EU', location: 'Frankfurt, DE', url: 'https://speed.cloudflare.com' },
];

/** Fetch the user's public IP and ISP via Cloudflare's trace endpoint */
async function fetchNetworkInfo(): Promise<{ ip: string; isp: string }> {
  try {
    const res = await fetch('https://speed.cloudflare.com/meta', { cache: 'no-store' });
    if (res.ok) {
      const data = (await res.json()) as { clientIp?: string; asOrganization?: string };
      return {
        ip: data.clientIp ?? 'Unknown',
        isp: data.asOrganization ?? 'Unknown ISP',
      };
    }
  } catch { /* fallback below */ }

  try {
    const res = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
    if (res.ok) {
      const data = (await res.json()) as { ip?: string };
      return { ip: data.ip ?? 'Unknown', isp: 'Unknown ISP' };
    }
  } catch { /* ignore */ }

  return { ip: 'Unknown', isp: 'Unknown ISP' };
}

/** Measure round-trip ping in ms by timing a HEAD request */
async function measurePing(url: string): Promise<number> {
  const samples: number[] = [];
  for (let i = 0; i < 5; i++) {
    const t0 = performance.now();
    try {
      await fetch(`${url}/__down?bytes=0`, {
        cache: 'no-store',
        method: 'HEAD',
      });
    } catch { /* network errors contribute to latency */ }
    samples.push(performance.now() - t0);
    await sleep(100);
  }
  samples.sort((a, b) => a - b);
  const trimmed = samples.slice(1, 4); // drop min/max
  return Math.round(trimmed.reduce((s, v) => s + v, 0) / trimmed.length);
}

/** Calculate jitter from an array of ping samples */
function calcJitter(samples: number[]): number {
  if (samples.length < 2) return 0;
  const diffs = samples.slice(1).map((v, i) => Math.abs(v - samples[i]));
  return Math.round(diffs.reduce((s, v) => s + v, 0) / diffs.length);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Measure download speed by fetching progressively larger payloads */
async function measureDownload(
  onProgress: (mbps: number, progress: number) => void,
  signal: AbortSignal,
): Promise<number> {
  const sizes = [
    { bytes: 100_000, label: '100KB' },
    { bytes: 1_000_000, label: '1MB' },
    { bytes: 10_000_000, label: '10MB' },
    { bytes: 25_000_000, label: '25MB' },
  ];

  const readings: number[] = [];
  let step = 0;

  for (const { bytes } of sizes) {
    if (signal.aborted) break;
    const url = `https://speed.cloudflare.com/__down?bytes=${bytes}&_=${Date.now()}`;
    const t0 = performance.now();
    try {
      const res = await fetch(url, { cache: 'no-store', signal });
      const data = await res.arrayBuffer();
      const elapsed = (performance.now() - t0) / 1000;
      const mbps = (data.byteLength * 8) / 1_000_000 / elapsed;
      readings.push(mbps);
      step++;
      const displayed = readings.length > 1 ? Math.max(...readings.slice(-2)) : mbps;
      onProgress(parseFloat(displayed.toFixed(2)), step / sizes.length);
    } catch {
      if (signal.aborted) break;
    }
  }

  if (readings.length === 0) return 0;
  // Return 90th-percentile-ish value (avoid outlier bursts)
  readings.sort((a, b) => a - b);
  return parseFloat(readings[Math.floor(readings.length * 0.85)].toFixed(2));
}

/** Measure upload speed by POSTing random data */
async function measureUpload(
  onProgress: (mbps: number, progress: number) => void,
  signal: AbortSignal,
): Promise<number> {
  const sizes = [100_000, 1_000_000, 5_000_000, 10_000_000];
  const readings: number[] = [];
  let step = 0;

  for (const bytes of sizes) {
    if (signal.aborted) break;
    const body = new Uint8Array(bytes);
    crypto.getRandomValues(body.slice(0, Math.min(bytes, 65536))); // partial randomization for speed
    const t0 = performance.now();
    try {
      await fetch('https://speed.cloudflare.com/__up', {
        method: 'POST',
        body,
        cache: 'no-store',
        signal,
        headers: { 'Content-Type': 'application/octet-stream' },
      });
      const elapsed = (performance.now() - t0) / 1000;
      const mbps = (bytes * 8) / 1_000_000 / elapsed;
      readings.push(mbps);
      step++;
      const displayed = readings.length > 1 ? Math.max(...readings.slice(-2)) : mbps;
      onProgress(parseFloat(displayed.toFixed(2)), step / sizes.length);
    } catch {
      if (signal.aborted) break;
    }
  }

  if (readings.length === 0) return 0;
  readings.sort((a, b) => a - b);
  return parseFloat(readings[Math.floor(readings.length * 0.85)].toFixed(2));
}

export interface SpeedTestCallbacks {
  onPhaseChange: (phase: TestState['phase']) => void;
  onPingUpdate: (ping: number, jitter: number) => void;
  onDownloadUpdate: (mbps: number, progress: number) => void;
  onUploadUpdate: (mbps: number, progress: number) => void;
  onComplete: (result: Omit<TestState, 'phase' | 'progress'>) => void;
  onError: (msg: string) => void;
}

export function runSpeedTest(
  serverId: string,
  callbacks: SpeedTestCallbacks,
): { abort: () => void } {
  const controller = new AbortController();
  const server = SERVERS.find((s) => s.id === serverId) ?? SERVERS[0];

  (async () => {
    try {
      // Phase 1: Finding server & IP info
      callbacks.onPhaseChange('finding-server');
      const { ip, isp } = await fetchNetworkInfo();
      await sleep(800);

      // Phase 2: Ping
      callbacks.onPhaseChange('ping');
      const pingSamples: number[] = [];
      for (let i = 0; i < 5; i++) {
        if (controller.signal.aborted) return;
        const t0 = performance.now();
        try {
          await fetch(`${server.url}/__down?bytes=0&_=${Date.now()}`, {
            cache: 'no-store',
            method: 'HEAD',
          });
        } catch { /* ignore */ }
        pingSamples.push(performance.now() - t0);
        await sleep(120);
      }
      pingSamples.sort((a, b) => a - b);
      const avgPing = Math.round(pingSamples.slice(1, 4).reduce((s, v) => s + v, 0) / 3);
      const jitter = calcJitter(pingSamples);
      callbacks.onPingUpdate(avgPing, jitter);
      await sleep(400);

      // Phase 3: Download
      callbacks.onPhaseChange('download');
      const download = await measureDownload(callbacks.onDownloadUpdate, controller.signal);
      if (controller.signal.aborted) return;
      await sleep(300);

      // Phase 4: Upload
      callbacks.onPhaseChange('upload');
      const upload = await measureUpload(callbacks.onUploadUpdate, controller.signal);
      if (controller.signal.aborted) return;
      await sleep(300);

      // Phase 5: Complete
      callbacks.onPhaseChange('complete');
      callbacks.onComplete({ download, upload, ping: avgPing, jitter, ip, isp, server: server.name });
    } catch (err) {
      if (!controller.signal.aborted) {
        callbacks.onError(err instanceof Error ? err.message : 'Test failed');
      }
    }
  })();

  return { abort: () => controller.abort() };
}

export { measurePing, fetchNetworkInfo };
