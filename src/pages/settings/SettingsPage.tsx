import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Cpu, 
  Save, 
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode, isDemoMode, setDemoMode, addToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [shelfLifeThreshold, setShelfLifeThreshold] = useState(2);
  const [autoRotate, setAutoRotate] = useState(true);

  const handleSaveSettings = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Platform preferences updated successfully.'
    });
  };

  return (
    <div id="settings-page" className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <span className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
          <Settings className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Application Preferences & Model Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure appearance, AI model operational mode, and alert triggers.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
        {/* Appearance Mode */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Dark Theme Interface</span>
            </div>
            <p className="text-slate-500 mt-0.5">Toggle between crisp modern light and dark modes.</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
          >
            {isDarkMode ? 'Active (Dark)' : 'Active (Light)'}
          </button>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Deterministic Demo Engine Mode</span>
            </div>
            <p className="text-slate-500 mt-0.5">Simulate vision inferences without remote API keys or when offline.</p>
          </div>
          <button
            onClick={() => {
              setDemoMode(!isDemoMode);
              addToast({
                type: 'info',
                title: !isDemoMode ? 'Demo Mode Activated' : 'Live Gemini AI Mode Activated',
                message: !isDemoMode ? 'Now using simulated vision model data.' : 'Now connecting to Gemini Vision API.'
              });
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              isDemoMode
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}
          >
            {isDemoMode ? 'Demo Mode Active' : 'Live AI Active'}
          </button>
        </div>

        {/* Alert Threshold */}
        <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Shelf-Life Warning Threshold: {shelfLifeThreshold} Days
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={shelfLifeThreshold}
            onChange={(e) => setShelfLifeThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <p className="text-slate-400 text-[11px]">Send alert when produce has &le; {shelfLifeThreshold} days remaining.</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
