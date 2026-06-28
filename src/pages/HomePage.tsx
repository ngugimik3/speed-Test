import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiWifi, FiServer, FiGlobe } from 'react-icons/fi';

import { Gauge } from '../components/Gauge/Gauge';
import { StartButton } from '../components/Buttons/StartButton';
import { MetricCard, InfoBadge } from '../components/Cards/MetricCard';
import { PhaseIndicator } from '../components/Loader/Loader';
import { useSpeedTest } from '../hooks/useSpeedTest';
import { useApp } from '../context/AppContext';
import { generateId, formatDate, phaseLabel } from '../utils';
import { SERVERS } from '../services/speedTest';

export function HomePage() {
  const { state, start, stop, reset } = useSpeedTest();
  const { settings, addResult } = useApp();

  const server = SERVERS.find((s) => s.id === settings.selectedServerId) ?? SERVERS[0];

  const handleStart = () => {
    reset();
    start(settings.selectedServerId);
  };

  useEffect(() => {
    if (state.phase === 'complete') {
      const { date, time } = formatDate(Date.now());
      addResult({
        id: generateId(),
        download: state.download,
        upload: state.upload,
        ping: state.ping,
        jitter: state.jitter,
        ip: state.ip,
        isp: state.isp,
        server: state.server || server.name,
        date,
        time,
        timestamp: Date.now(),
      });
      toast.success('Speed test complete!', { icon: '⚡' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const activeValue =
    state.phase === 'download' ? state.download :
    state.phase === 'upload' ? state.upload : 0;

  const isActive = state.phase === 'download' || state.phase === 'upload';

  return (
    <div className="min-h-screen pb-20 md:pb-8 px-4 md:px-8 pt-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Internet Speed Test</h1>
        <p className="text-gray-500 text-sm mt-1">Measure your real-world connection speed</p>
      </motion.div>

      {/* Gauge area */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <Gauge value={activeValue} active={isActive} />

        <AnimatePresence mode="wait">
          {state.phase !== 'idle' && (
            <motion.div
              key={state.phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-3"
            >
              <PhaseIndicator phase={state.phase} />
              <p className="text-sm text-brand font-medium">{phaseLabel(state.phase)}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <StartButton phase={state.phase} onStart={handleStart} onStop={stop} />

        {state.phase === 'complete' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleStart}
            className="text-sm text-gray-400 hover:text-brand transition-colors underline underline-offset-4"
          >
            Run again
          </motion.button>
        )}
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricCard
          label="Download"
          value={state.download === 0 ? '—' : state.download.toFixed(1)}
          unit="Mbps"
          color="cyan"
          delay={0}
        />
        <MetricCard
          label="Upload"
          value={state.upload === 0 ? '—' : state.upload.toFixed(1)}
          unit="Mbps"
          color="purple"
          delay={0.05}
        />
        <MetricCard
          label="Ping"
          value={state.ping === 0 ? '—' : state.ping}
          unit="ms"
          color="green"
          delay={0.1}
        />
        <MetricCard
          label="Jitter"
          value={state.jitter === 0 ? '—' : state.jitter}
          unit="ms"
          color="yellow"
          delay={0.15}
        />
      </div>

      {/* Info badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <InfoBadge label="Public IP" value={state.ip} icon={<FiGlobe className="w-4 h-4" />} />
        <InfoBadge label="ISP" value={state.isp} icon={<FiWifi className="w-4 h-4" />} />
        <InfoBadge label="Server" value={server.name} icon={<FiServer className="w-4 h-4" />} />
      </div>
    </div>
  );
}
