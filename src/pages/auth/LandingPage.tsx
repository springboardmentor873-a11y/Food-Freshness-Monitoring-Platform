import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Sparkles, 
  ScanLine, 
  ShieldCheck, 
  Thermometer, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  Store, 
  Building2, 
  Microscope,
  Layers,
  Sun,
  Moon
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const { switchRole } = useAuth();
  const { setCurrentPage, isDarkMode, toggleDarkMode } = useApp();

  const handleRoleQuickLaunch = (role: UserRole) => {
    switchRole(role);
    onGetStarted();
  };

  return (
    <div id="landing-page" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                FreshSense<span className="text-emerald-600 dark:text-emerald-400"> AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            >
              Launch Live App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>AI-Powered Food Freshness & Quality Monitoring Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Prevent Food Spoilage with{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              Precision Computer Vision
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Instant 0–100 freshness scoring, thermodynamic shelf-life forecasting, and cold chain telemetry across consumers, retailers, and food safety inspectors.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all hover:scale-105"
            >
              <ScanLine className="w-5 h-5" />
              <span>Start Free Food Scan</span>
            </button>

            <button
              onClick={() => handleRoleQuickLaunch('Retail Manager')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm transition-all"
            >
              <Store className="w-5 h-5 text-teal-600" />
              <span>Explore Retail FIFO Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-Pillars Scoring Model Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              The 4-Pillar Scientific Freshness Model
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              FreshSense AI translates spectral cues and environmental telemetry into an objective freshness index.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full inline-block">
                40% Weight
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Visual Condition
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Color degradation, cellular turgidity loss, surface fungal detection, and bruising analysis.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <span className="text-xs font-black text-teal-600 bg-teal-100 dark:bg-teal-950 px-2.5 py-1 rounded-full inline-block">
                25% Weight
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Storage Conditions
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cold chain thermal stability, relative humidity compliance, light exposure, and airflow control.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <span className="text-xs font-black text-cyan-600 bg-cyan-100 dark:bg-cyan-950 px-2.5 py-1 rounded-full inline-block">
                20% Weight
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Shelf-Life Prediction
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Arrhenius-derived biochemical decay curves calculating accurate remaining consumable days.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <span className="text-xs font-black text-indigo-600 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-1 rounded-full inline-block">
                15% Weight
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Product Age Index
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Post-harvest chronological age adjusted for cultivar cellular resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Profiles Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tailored for Every Node in the Food Supply Chain
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Switch roles seamlessly in the live demo to experience custom workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => handleRoleQuickLaunch('Consumer')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 cursor-pointer transition-all group"
            >
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 w-fit mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                Consumers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Pantry freshness tracking, zero-waste recipes, and remaining days alerts for household groceries.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span>Enter Smart Kitchen</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => handleRoleQuickLaunch('Retail Manager')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500 cursor-pointer transition-all group"
            >
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 w-fit mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600">
                Retail Managers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Automated FIFO stock rotation, Markdown queues, and shelf freshness audits to cut shrinkage.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-600">
                <span>Enter Store Console</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => handleRoleQuickLaunch('Warehouse Operator')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 cursor-pointer transition-all group"
            >
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 w-fit mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                Warehouse Operators
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Cold chain sensors, controlled atmosphere chambers, and temperature excursion prevention.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
                <span>Enter Cold Chain Hub</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => handleRoleQuickLaunch('Food Quality Inspector')}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500 cursor-pointer transition-all group"
            >
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 w-fit mb-4">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600">
                Quality Inspectors
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                HACCP safety certifications, spoilage risk grading, and batch audit logs for compliance.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-600">
                <span>Enter Lab Auditor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        <p>FreshSense AI • AI-Powered Food Freshness & Quality Monitoring Platform</p>
      </footer>
    </div>
  );
};
