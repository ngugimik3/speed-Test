import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiTrash2, FiTrash } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/Loader/Loader';

export function HistoryPage() {
  const { history, deleteResult, clearHistory } = useApp();

  const handleClear = () => {
    clearHistory();
    toast.success('History cleared');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 px-4 md:px-8 pt-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Test History</h1>
          <p className="text-gray-500 text-sm mt-1">{history.length} test{history.length !== 1 ? 's' : ''} recorded</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg"
          >
            <FiTrash className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState message="No tests yet. Run your first speed test to see results here." icon="📊" />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {history.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-surface-card border border-surface-border rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500">{r.date} · {r.time}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{r.isp} · {r.server}</p>
                  </div>
                  <button
                    onClick={() => { deleteResult(r.id); toast('Record deleted', { icon: '🗑️' }); }}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                    aria-label="Delete record"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <Stat label="Download" value={r.download.toFixed(1)} unit="Mbps" color="text-cyan-400" />
                  <Stat label="Upload" value={r.upload.toFixed(1)} unit="Mbps" color="text-purple-400" />
                  <Stat label="Ping" value={String(r.ping)} unit="ms" color="text-green-400" />
                  <Stat label="Jitter" value={String(r.jitter)} unit="ms" color="text-yellow-400" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className={`text-lg font-bold ${color} tabular-nums`}>{value}</p>
      <p className="text-[10px] text-gray-600">{unit}</p>
    </div>
  );
}
