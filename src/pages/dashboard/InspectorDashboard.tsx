import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardCheck, 
  ShieldAlert, 
  CheckCircle2, 
  ScanLine, 
  FileText, 
  ArrowRight,
  AlertTriangle,
  Microscope
} from 'lucide-react';

export const InspectorDashboard: React.FC = () => {
  const { analyses, setCurrentPage, setSelectedAnalysisId } = useApp();

  const highConfidenceScans = analyses.filter((a) => a.confidence >= 0.9);
  const flaggedItems = analyses.filter((a) => a.predictedClass === 'Near Spoilage' || a.predictedClass === 'Spoiled');

  return (
    <div id="inspector-dashboard" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Microscope className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Food Quality & Safety Inspection Console
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AgriQuality Safety Authority • Batch Certification & Spoilage Auditing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('analyze')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <ScanLine className="w-4 h-4" />
            <span>Launch Batch Lab Scan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Inspection Queue</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            14 <span className="text-xs font-semibold text-slate-400">batches</span>
          </div>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Pending QA sign-off</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Model Verification Rate</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            94.8%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Ground truth match</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Flagged Spoilage Risk</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            {flaggedItems.length} <span className="text-xs font-semibold text-slate-400">samples</span>
          </div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Fungal / textural defect</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Audits Completed (MTD)</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            186
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Exportable PDF logs</p>
        </div>
      </div>

      {/* Flagged & High Risk Inspection Queue */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-emerald-500" />
            <span>Recent Spoilage Lab Evaluations</span>
          </h3>
          <span className="text-xs text-slate-400">Click any evaluation for multi-spectral breakdown</span>
        </div>

        <div className="space-y-3">
          {analyses.map((a) => (
            <div
              key={a.id}
              onClick={() => {
                setSelectedAnalysisId(a.id);
                setCurrentPage('analysis-detail');
              }}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <img src={a.imageUrl} alt={a.foodName} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600">
                    {a.foodName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Batch: {a.batchId || 'N/A'} • Evaluated: {new Date(a.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Classification: <span className={a.freshnessScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}>{a.predictedClass}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Confidence: {(a.confidence * 100).toFixed(0)}% • Spoilage Risk: {(a.spoilageProbability * 100).toFixed(0)}%
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
