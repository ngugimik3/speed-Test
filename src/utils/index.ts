import type { Stats, TestResult } from '../types';

export function formatMbps(v: number): string {
  return v === 0 ? '—' : v.toFixed(1);
}

export function formatDate(ts: number): { date: string; time: string } {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function computeStats(history: TestResult[]): Stats {
  if (history.length === 0) {
    return { fastestDownload: 0, fastestUpload: 0, lowestPing: 0, averageDownload: 0, averageUpload: 0, totalTests: 0 };
  }
  return {
    fastestDownload: Math.max(...history.map((r) => r.download)),
    fastestUpload: Math.max(...history.map((r) => r.upload)),
    lowestPing: Math.min(...history.map((r) => r.ping)),
    averageDownload: parseFloat((history.reduce((s, r) => s + r.download, 0) / history.length).toFixed(1)),
    averageUpload: parseFloat((history.reduce((s, r) => s + r.upload, 0) / history.length).toFixed(1)),
    totalTests: history.length,
  };
}

/** Map Mbps value to speedometer angle (-135 to 135 degrees) */
export function mbpsToAngle(mbps: number, max = 1000): number {
  const clamped = Math.min(mbps, max);
  return -135 + (clamped / max) * 270;
}

export function phaseLabel(phase: string): string {
  switch (phase) {
    case 'finding-server': return 'Finding Best Server…';
    case 'ping': return 'Measuring Ping…';
    case 'download': return 'Testing Download…';
    case 'upload': return 'Testing Upload…';
    case 'complete': return 'Test Complete';
    default: return '';
  }
}
