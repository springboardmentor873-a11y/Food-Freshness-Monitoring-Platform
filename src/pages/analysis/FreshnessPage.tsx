import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FreshnessCategory, FoodCategory } from '../../types';
import { 
  Sparkles, 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight,
  ScanLine,
  Trash2,
  Eye,
  Thermometer,
  Clock,
  Calendar
} from 'lucide-react';

export const FreshnessPage: React.FC = () => {
  const { analyses, deleteAnalysis, setSelectedAnalysisId, setCurrentPage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFreshness, setSelectedFreshness] = useState<string>('All');

  const filteredAnalyses = analyses.filter((a) => {
    const matchesSearch = a.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.batchId && a.batchId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesFresh = selectedFreshness === 'All' || a.predictedClass === selectedFreshness;
    return matchesSearch && matchesCat && matchesFresh;
  });

  return (
    <div id="freshness-scoring-page" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Freshness Scoring & Mathematical Quality Model
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-parameter weighted algorithm combining visual defect detection with thermodynamic decay.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('analyze')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <ScanLine className="w-4 h-4" />
          <span>New AI Scan</span>
        </button>
      </div>

      {/* Conceptual Weighted Model Explanation Cards (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Eye className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              40% Weight
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Visual Condition Analysis
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Neural vision extraction evaluates chlorophyll reflectance, surface turgidity, bruising, and fungal colonies.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600">
              <Thermometer className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full">
              25% Weight
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Storage Conditions
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Measures compliance of storage temperature, relative humidity, light exposure, and air circulation limits.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded-full">
              20% Weight
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Shelf-Life Prediction
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Predictive biochemical degradation curve calculating remaining days before microbial risk escalation.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
              15% Weight
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Product Age Index
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Elapsed post-harvest storage duration adjusted for cultivar cellular resilience.
          </p>
        </div>
      </div>

      {/* Complete Historical Scan Registry */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Analysis Log & History ({filteredAnalyses.length})
            </h3>
            <p className="text-[11px] text-slate-400">All registered vision scans</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search food / batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
            </select>

            <select
              value={selectedFreshness}
              onChange={(e) => setSelectedFreshness(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Classes</option>
              <option value="Fresh">Fresh</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
              <option value="Near Spoilage">Near Spoilage</option>
              <option value="Spoiled">Spoiled</option>
            </select>
          </div>
        </div>

        {/* Scan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400">
                <th className="pb-3 font-semibold">Produce</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Freshness Score</th>
                <th className="pb-3 font-semibold">Classification</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold">Shelf Life</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching scan records found.
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={a.imageUrl} alt={a.foodName} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">{a.foodName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{a.batchId || 'NO-BATCH'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{a.category}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-emerald-600 dark:text-emerald-400">{a.freshnessScore}</span>
                        <span className="text-[10px] text-slate-400">/100</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.freshnessScore >= 85
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : a.freshnessScore >= 60
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {a.predictedClass}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 font-medium">
                      {(a.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 font-semibold">
                      {a.remainingShelfLifeDays} days
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {new Date(a.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedAnalysisId(a.id);
                            setCurrentPage('analysis-detail');
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                          title="View Full Analysis"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAnalysis(a.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
