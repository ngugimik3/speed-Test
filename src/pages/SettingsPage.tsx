import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMoon, FiSun, FiServer, FiTrash2 } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { SERVERS } from '../services/speedTest';

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}

function Toggle({ label, description, checked, onChange, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-surface-border last:border-0">
      <div className="flex items-center gap-3">
        {icon && <span className="text-gray-400">{icon}</span>}
        <div>
          <p className="text-sm font-medium text-gray-200">{label}</p>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          checked ? 'bg-brand' : 'bg-gray-700'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const { settings, updateSettings, clearHistory } = useApp();

  const handleClearHistory = () => {
    clearHistory();
    toast.success('History cleared');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 px-4 md:px-8 pt-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Customize your experience</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <Section title="Appearance">
          <Toggle
            label="Dark Mode"
            description="Use dark interface theme"
            checked={settings.darkMode}
            onChange={(v) => updateSettings({ darkMode: v })}
            icon={settings.darkMode ? <FiMoon /> : <FiSun />}
          />
        </Section>

        {/* Server */}
        <Section title="Test Server">
          <Toggle
            label="Auto-select Server"
            description="Automatically find the fastest server"
            checked={settings.autoSelectServer}
            onChange={(v) => updateSettings({ autoSelectServer: v })}
            icon={<FiServer />}
          />
          {!settings.autoSelectServer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-4"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Select Server</p>
              <div className="space-y-2">
                {SERVERS.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      settings.selectedServerId === s.id
                        ? 'border-brand/50 bg-brand/5'
                        : 'border-surface-border hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="server"
                      value={s.id}
                      checked={settings.selectedServerId === s.id}
                      onChange={() => updateSettings({ selectedServerId: s.id })}
                      className="accent-brand"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-200">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.location}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </Section>

        {/* Data */}
        <Section title="Data">
          <div className="py-3">
            <p className="text-sm font-medium text-gray-200 mb-1">Clear Test History</p>
            <p className="text-xs text-gray-500 mb-4">Permanently delete all recorded speed test results.</p>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors px-4 py-2.5 rounded-xl font-medium"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear all history
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h2>
      {children}
    </div>
  );
}
