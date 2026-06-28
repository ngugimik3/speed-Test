import { motion } from 'framer-motion';

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className="rounded-full border-2 border-surface-border border-t-brand"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 animate-pulse">
      <div className="h-3 w-20 bg-surface-border rounded mb-4" />
      <div className="h-8 w-28 bg-surface-border rounded" />
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-5xl">{icon ?? '📭'}</span>
      <p className="text-gray-400 text-sm max-w-xs">{message}</p>
    </div>
  );
}

export function PhaseIndicator({ phase }: { phase: string }) {
  const phases = ['finding-server', 'ping', 'download', 'upload', 'complete'];
  const current = phases.indexOf(phase);

  return (
    <div className="flex items-center gap-1.5">
      {phases.slice(0, 4).map((p, i) => (
        <motion.div
          key={p}
          className={`h-1 rounded-full transition-all duration-500 ${
            i <= current - 1 ? 'bg-brand' : i === current ? 'bg-brand/60' : 'bg-surface-border'
          }`}
          style={{ width: i === current ? 24 : 16 }}
        />
      ))}
    </div>
  );
}
