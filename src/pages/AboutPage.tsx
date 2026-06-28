import { motion } from 'framer-motion';
import { FiZap, FiGithub, FiShield, FiGlobe } from 'react-icons/fi';

const features = [
  { icon: FiZap, label: 'Real Measurements', desc: 'Uses actual network requests against Cloudflare\'s global edge network for accurate results.' },
  { icon: FiShield, label: 'Privacy First', desc: 'No data is stored on any server. All history is saved locally in your browser.' },
  { icon: FiGlobe, label: 'Open Standard', desc: 'Built using standard Web APIs — no browser plugins or native apps required.' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-8 px-4 md:px-8 pt-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">About SwiftTest</h1>
        <p className="text-gray-500 text-sm mt-1">Version 1.0.0</p>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand/10 to-purple-500/10 border border-brand/20 rounded-2xl p-6 text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center">
              <FiZap className="w-8 h-8 text-brand" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">SwiftTest</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            A premium internet speed test application built with React, Framer Motion, and real-world network measurement APIs.
          </p>
        </motion.div>

        <div className="space-y-3">
          {features.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface-card border border-surface-border rounded-2xl p-5 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">{label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'React Router'].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-lg bg-surface-border text-xs font-medium text-gray-300">{t}</span>
            ))}
          </div>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-200">Open Source</p>
            <p className="text-xs text-gray-500 mt-0.5">MIT License</p>
          </div>
          <FiGithub className="w-5 h-5 text-gray-400" />
        </div>

        <p className="text-center text-xs text-gray-600 pb-4">
          Speed measurements use Cloudflare's speed.cloudflare.com infrastructure.
          Results may vary based on network conditions.
        </p>
      </div>
    </div>
  );
}
