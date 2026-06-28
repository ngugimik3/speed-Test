import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import type { TestResult } from '../../types';

interface ChartData {
  label: string;
  download: number;
  upload: number;
  ping: number;
}

function buildChartData(history: TestResult[]): ChartData[] {
  return [...history].reverse().map((r, i) => ({
    label: `#${i + 1}`,
    download: r.download,
    upload: r.upload,
    ping: r.ping,
  }));
}

const tooltipStyle = {
  backgroundColor: '#161b22',
  border: '1px solid #21262d',
  borderRadius: 8,
  color: '#f9fafb',
  fontSize: 12,
};

interface SpeedChartProps {
  history: TestResult[];
}

export function SpeedChart({ history }: SpeedChartProps) {
  const data = buildChartData(history);

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Download &amp; Upload History</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#21262d" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} unit=" Mbps" width={72} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toFixed(1)} Mbps`]} />
          <Area type="monotone" dataKey="download" stroke="#00d4ff" strokeWidth={2} fill="url(#dlGrad)" name="Download" dot={false} />
          <Area type="monotone" dataKey="upload" stroke="#a855f7" strokeWidth={2} fill="url(#ulGrad)" name="Upload" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-3">
        <Legend color="#00d4ff" label="Download" />
        <Legend color="#a855f7" label="Upload" />
      </div>
    </div>
  );
}

export function PingChart({ history }: SpeedChartProps) {
  const data = buildChartData(history);

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Ping History</h3>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid stroke="#21262d" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} unit=" ms" width={56} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} ms`]} />
          <Line type="monotone" dataKey="ping" stroke="#facc15" strokeWidth={2} dot={{ fill: '#facc15', r: 3 }} name="Ping" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-3">
        <Legend color="#facc15" label="Ping (ms)" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
