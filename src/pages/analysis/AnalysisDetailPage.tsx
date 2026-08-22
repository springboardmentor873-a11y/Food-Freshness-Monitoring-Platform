import React from 'react';
import { useApp } from '../../context/AppContext';
import { AnalysisResultView } from '../../components/analysis/AnalysisResultView';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const AnalysisDetailPage: React.FC = () => {
  const { selectedAnalysisId, analyses, setCurrentPage } = useApp();

  const activeResult = analyses.find((a) => a.id === selectedAnalysisId) || analyses[0];

  if (!activeResult) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">Analysis record not found.</p>
        <button
          onClick={() => setCurrentPage('analyze')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Scan Food Item
        </button>
      </div>
    );
  }

  return (
    <div id="analysis-detail-page" className="space-y-4">
      <button
        onClick={() => setCurrentPage('freshness')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Freshness Log</span>
      </button>

      <AnalysisResultView
        result={activeResult}
        onScanAnother={() => setCurrentPage('analyze')}
      />
    </div>
  );
};
