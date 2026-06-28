import { motion } from 'framer-motion';
import type { TestPhase } from '../../types';

interface StartButtonProps {
  phase: TestPhase;
  onStart: () => void;
  onStop: () => void;
}

const isRunning = (phase: TestPhase) =>
  phase !== 'idle' && phase !== 'complete';

export function StartButton({ phase, onStart, onStop }: StartButtonProps) {
  const running = isRunning(phase);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse rings */}
      {running && (
        <>
          <motion.div
            className="absolute rounded-full border border-brand/30"
            style={{ width: 180, height: 180 }}
            animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.div
            className="absolute rounded-full border border-brand/20"
            style={{ width: 180, height: 180 }}
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
          />
        </>
      )}

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={running ? onStop : onStart}
        disabled={phase === 'complete'}
        className={`relative w-36 h-36 rounded-full font-bold text-lg tracking-wide transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/50 ${
          running
            ? 'bg-red-500/10 border-2 border-red-500/60 text-red-400 hover:border-red-400'
            : phase === 'complete'
            ? 'bg-brand/10 border-2 border-brand/40 text-brand cursor-default'
            : 'bg-gradient-to-br from-brand/20 to-purple-500/20 border-2 border-brand/60 text-white hover:border-brand hover:shadow-[0_0_40px_rgba(0,212,255,0.3)]'
        }`}
        style={running ? {} : { boxShadow: '0 0 30px rgba(0,212,255,0.15)' }}
      >
        {/* Inner gradient circle */}
        <div className={`absolute inset-3 rounded-full ${
          running ? 'bg-red-500/5' : 'bg-gradient-to-br from-brand/10 to-transparent'
        }`} />

        <span className="relative z-10">
          {running ? 'STOP' : phase === 'complete' ? 'DONE' : 'GO'}
        </span>
      </motion.button>
    </div>
  );
}
