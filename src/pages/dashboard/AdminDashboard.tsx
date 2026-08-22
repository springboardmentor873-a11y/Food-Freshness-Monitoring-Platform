import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Cpu, 
  Users, 
  Activity, 
  Database, 
  Zap, 
  Server, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { analyses, inventory, modelMetadata, setCurrentPage } = useApp();

  return (
    <div id="admin-dashboard" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              FreshSense System Telemetry & Administration
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Model Version: {modelMetadata.version} • API Health: Operational (200 OK)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('admin-model')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Cpu className="w-4 h-4" />
            <span>AI Model Diagnostics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Active Users</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            1,280
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Across 5 enterprise roles</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Model Inferences</span>
            <Activity className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            18,420
          </div>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">99.98% uptime</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Inference Latency</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {modelMetadata.metrics.avgLatencyMs} <span className="text-xs font-semibold text-slate-400">ms</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">P95 latency benchmark</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Database Nodes</span>
            <Database className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            PostgreSQL
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Primary cloud instance</p>
        </div>
      </div>

      {/* Model Diagnostic Overview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span>AI Model Architecture & Active Deployment</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Status: {modelMetadata.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 font-medium">Model Engine:</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">{modelMetadata.modelName}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{modelMetadata.framework}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 font-medium">Training Dataset:</span>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">{modelMetadata.datasetSize}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Last Trained: {modelMetadata.lastTrained}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 font-medium">Accuracy Verification:</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {modelMetadata.metrics.accuracy ? `${(modelMetadata.metrics.accuracy * 100).toFixed(1)}% Validation Accuracy` : 'Demo Data'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Loss: {modelMetadata.metrics.loss ?? 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
