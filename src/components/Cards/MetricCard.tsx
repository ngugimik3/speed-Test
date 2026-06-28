import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  color?: 'cyan' | 'purple' | 'green' | 'yellow';
  delay?: number;
}

const colors = {
  cyan: 'from-cyan-500/10 to-cyan-500/0 border-cyan-500/20 text-cyan-400',
  purple: 'from-purple-500/10 to-purple-500/0 border-purple-500/20 text-purple-400',
  green: 'from-green-500/10 to-green-500/0 border-green-500/20 text-green-400',
  yellow: 'from-yellow-500/10 to-yellow-500/0 border-yellow-500/20 text-yellow-400',
};

export function MetricCard({ label, value, unit, icon, color = 'cyan', delay = 0 }: MetricCardProps) {
  const c = colors[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`bg-gradient-to-b ${c} border rounded-2xl p-5 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
        {icon && <span className={`${c.split(' ').at(-1)}`}>{icon}</span>}
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold text-white tabular-nums leading-none">{value === 0 ? '—' : value}</span>
        {unit && <span className="text-sm text-gray-400 mb-0.5">{unit}</span>}
      </div>
    </motion.div>
  );
}

interface InfoBadgeProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

export function InfoBadge({ label, value, icon }: InfoBadgeProps) {
  return (
    <div className="flex items-center gap-3 bg-surface-card border border-surface-border rounded-xl px-4 py-3">
      {icon && <span className="text-gray-500">{icon}</span>}
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm text-gray-200 font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  );
}
