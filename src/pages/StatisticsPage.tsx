import { motion } from 'framer-motion';
import { FiDownload, FiUpload, FiActivity, FiZap } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { SpeedChart, PingChart } from '../components/Charts/Charts';
import { EmptyState } from '../components/Loader/Loader';
import { computeStats } from '../utils';

export function StatisticsPage() {
  const { history } = useApp();
  const stats = computeStats(history);

  return (
    <div className="min-h-screen pb-20 md:pb-8 px-4 md:px-8 pt-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Statistics</h1>
        <p className="text-gray-500 text-sm mt-1">Aggregated from {stats.totalTests} test{stats.totalTests !== 1 ? 's' : ''}</p>
      </div>

      {history.length === 0 ? (
        <EmptyState message="Run at least one test to view statistics and charts." icon="📈" />
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Fastest Download', value: stats.fastestDownload.toFixed(1), unit: 'Mbps', color: 'text-cyan-400', bg: 'from-cyan-500/10', border: 'border-cyan-500/20', icon: FiDownload },
              { label: 'Fastest Upload', value: stats.fastestUpload.toFixed(1), unit: 'Mbps', color: 'text-purple-400', bg: 'from-purple-500/10', border: 'border-purple-500/20', icon: FiUpload },
              { label: 'Lowest Ping', value: String(stats.lowestPing), unit: 'ms', color: 'text-green-400', bg: 'from-green-500/10', border: 'border-green-500/20', icon: FiActivity },
              { label: 'Avg Download', value: stats.averageDownload.toFixed(1), unit: 'Mbps', color: 'text-yellow-400', bg: 'from-yellow-500/10', border: 'border-yellow-500/20', icon: FiZap },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-gradient-to-b ${s.bg} to-transparent border ${s.border} rounded-2xl p-5`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</span>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.unit}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <SpeedChart history={history} />
          <PingChart history={history} />
        </div>
      )}
    </div>
  );
}
