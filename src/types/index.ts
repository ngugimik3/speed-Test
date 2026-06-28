export interface TestResult {
  id: string;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  ip: string;
  isp: string;
  server: string;
  date: string;
  time: string;
  timestamp: number;
}

export type TestPhase =
  | 'idle'
  | 'finding-server'
  | 'ping'
  | 'download'
  | 'upload'
  | 'complete';

export interface TestState {
  phase: TestPhase;
  ping: number;
  jitter: number;
  download: number;
  upload: number;
  ip: string;
  isp: string;
  server: string;
  progress: number;
}

export interface Server {
  id: string;
  name: string;
  location: string;
  url: string;
}

export interface AppSettings {
  darkMode: boolean;
  autoSelectServer: boolean;
  selectedServerId: string;
}

export interface Stats {
  fastestDownload: number;
  fastestUpload: number;
  lowestPing: number;
  averageDownload: number;
  averageUpload: number;
  totalTests: number;
}
