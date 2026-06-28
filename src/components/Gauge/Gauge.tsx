import { motion, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface GaugeProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  active?: boolean;
}

function polarToCart(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  if (endDeg <= startDeg) return `M ${polarToCart(cx, cy, r, startDeg).x} ${polarToCart(cx, cy, r, startDeg).y}`;
  const s = polarToCart(cx, cy, r, startDeg);
  const e = polarToCart(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function Gauge({ value, max = 1000, label = 'Mbps', size = 280, active = false }: GaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.37;
  const sw = size * 0.052;

  // Spring-animated value
  const spring = useSpring(0, { stiffness: 55, damping: 20 });
  useEffect(() => { spring.set(value); }, [value, spring]);

  // Needle rotation: maps 0→max to -135°→+135°
  const needleRotate = useTransform(spring, (v) => -135 + (Math.min(v, max) / max) * 270);

  // Reactive arc path via ref
  const arcRef = useRef<SVGPathElement>(null);
  useMotionValueEvent(spring, 'change', (v) => {
    if (!arcRef.current) return;
    const progress = Math.min(v, max) / max;
    const endDeg = -45 + progress * 270; // SVG degrees: start=-45 (=−135+90), sweep=270
    arcRef.current.setAttribute('d', arcPath(cx, cy, r, -45, endDeg));
  });

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const deg = -45 + i * 27;
    const rOuter = r + size * 0.048;
    const rInner = rOuter - (i % 5 === 0 ? size * 0.05 : size * 0.03);
    const s = polarToCart(cx, cy, rOuter, deg);
    const e = polarToCart(cx, cy, rInner, deg);
    return { s, e, major: i % 5 === 0 };
  });

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <path d={arcPath(cx, cy, r, -45, 225)} fill="none" stroke="#1f2937" strokeWidth={sw} strokeLinecap="round" />

        {/* Ticks */}
        {ticks.map(({ s, e, major }, i) => (
          <line key={i} x1={s.x} y1={s.y} x2={e.x} y2={e.y}
            stroke={major ? '#4b5563' : '#374151'}
            strokeWidth={major ? 1.5 : 1} />
        ))}

        {/* Neon progress arc — updated imperatively */}
        <path ref={arcRef} d="" fill="none" stroke="url(#arcGrad)" strokeWidth={sw} strokeLinecap="round" filter="url(#glow)" />

        {/* Pulse ring when active */}
        {active && (
          <motion.circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="#00d4ff" strokeWidth="1"
            animate={{ opacity: [0, 0.2, 0], scale: [0.88, 1.12, 0.88] }}
            transition={{ duration: 2.4, repeat: Infinity }} />
        )}

        {/* Needle */}
        <motion.g style={{ rotate: needleRotate, originX: `${cx}px`, originY: `${cy}px` }}>
          <line x1={cx} y1={cy + sw} x2={cx} y2={cy - r * 0.75}
            stroke="#e5e7eb" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={size * 0.024} fill="#e5e7eb" />
          <circle cx={cx} cy={cy} r={size * 0.011} fill="#00d4ff" />
        </motion.g>
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-end" style={{ paddingBottom: '13%' }}>
        <span className="text-4xl font-bold text-white tabular-nums leading-none"
          style={{ textShadow: active ? '0 0 28px rgba(0,212,255,0.6)' : 'none' }}>
          {value === 0 ? '0.0' : value.toFixed(1)}
        </span>
        <span className="text-[11px] font-semibold text-gray-500 mt-2 tracking-[0.2em] uppercase">{label}</span>
      </div>
    </div>
  );
}
