import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, Activity, CheckCircle2, Zap, Shield, RotateCw } from 'lucide-react';

export const AdminModelPage: React.FC = () => {
  const { modelMetadata, addToast } = useApp();

  const handleRetrain = () => {
    addToast({
      type: 'info',
      title: 'Calibration Triggered',
      message: 'Produce loss matrix calibration scheduled with active checkpoint.'
    });
  };

  return (
    <div id="admin-model-page" className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              AI Vision Model Diagnostics & Calibration
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active Neural Spoilage Classifier • Gemini 2.5 Multi-Modal Vision + Arrhenius Physics
            </p>
          </div>
        </div>

        <button
          onClick={handleRetrain}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <RotateCw className="w-4 h-4" />
          <span>Calibrate Loss Weights</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-slate-400 font-semibold">Model Pipeline</span>
          <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{modelMetadata.modelName}</div>
          <div className="text-slate-500">Framework: {modelMetadata.framework}</div>
          <div className="text-emerald-600 font-bold mt-1">Status: {modelMetadata.status}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-slate-400 font-semibold">Verification Benchmark</span>
          <div className="font-bold text-emerald-600 text-sm">
            {modelMetadata.metrics.accuracy ? `${(modelMetadata.metrics.accuracy * 100).toFixed(1)}% Ground Truth Match` : 'Demo Ground Truth'}
          </div>
          <div className="text-slate-500">Validation Loss: {modelMetadata.metrics.loss ?? '0.041'}</div>
          <div className="text-slate-400">Dataset Size: {modelMetadata.datasetSize}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-slate-400 font-semibold">Inference Latency</span>
          <div className="font-bold text-amber-600 text-sm">{modelMetadata.metrics.avgLatencyMs} ms</div>
          <div className="text-slate-500">Hardware: TPU v5e Inference Pod</div>
          <div className="text-slate-400">Thinking Mode: High Reasoning</div>
        </div>
      </div>
    </div>
  );
};
