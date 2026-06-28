import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppSettings, TestResult } from '../types';

const HISTORY_KEY = 'swifttest_history';
const SETTINGS_KEY = 'swifttest_settings';

const defaultSettings: AppSettings = {
  darkMode: true,
  autoSelectServer: true,
  selectedServerId: 'cf-auto',
};

interface AppContextValue {
  history: TestResult[];
  settings: AppSettings;
  addResult: (r: TestResult) => void;
  deleteResult: (id: string) => void;
  clearHistory: () => void;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<TestResult[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as TestResult[];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') } as AppSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings]);

  const addResult = (r: TestResult) =>
    setHistory((prev) => [r, ...prev].slice(0, 20));

  const deleteResult = (id: string) =>
    setHistory((prev) => prev.filter((r) => r.id !== id));

  const clearHistory = () => setHistory([]);

  const updateSettings = (s: Partial<AppSettings>) =>
    setSettings((prev) => ({ ...prev, ...s }));

  return (
    <AppContext.Provider value={{ history, settings, addResult, deleteResult, clearHistory, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
