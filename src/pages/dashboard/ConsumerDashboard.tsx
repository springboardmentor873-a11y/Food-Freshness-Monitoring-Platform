import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  ScanLine, 
  PlusCircle, 
  Package, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Leaf
} from 'lucide-react';

export const ConsumerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { analyses, inventory, setCurrentPage, setSelectedAnalysisId, setSelectedInventoryId } = useApp();

  const freshCount = inventory.filter((i) => i.freshnessCategory === 'Fresh' || i.freshnessCategory === 'Good').length;
  const atRiskCount = inventory.filter((i) => i.freshnessCategory === 'Near Spoilage' || i.status === 'Expiring Soon').length;
  const avgFreshness = inventory.length > 0 
    ? Math.round(inventory.reduce((acc, curr) => acc + curr.freshnessScore, 0) / inventory.length)
    : 92;

  const expiringSoonItems = inventory.filter((i) => i.remainingDays <= 2);

  return (
    <div id="consumer-dashboard" className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/15 relative overflow-hidden">
        {/* Background decorative leaf */}
        <Leaf className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10 pointer-events-none transform -rotate-12" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Kitchen Assistant</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-emerald-50 mt-1.5 leading-relaxed">
            Your pantry freshness index is healthy at <span className="font-extrabold text-white">{avgFreshness}/100</span>. You have {atRiskCount} item{atRiskCount === 1 ? '' : 's'} that should be enjoyed soon to prevent waste.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              id="consumer-analyze-btn"
              onClick={() => setCurrentPage('analyze')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-700 font-extrabold text-xs shadow-lg hover:bg-emerald-50 transition-all hover:scale-105"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Produce</span>
            </button>

            <button
              id="consumer-inventory-btn"
              onClick={() => setCurrentPage('inventory')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700/80 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all"
            >
              <Package className="w-4 h-4" />
              <span>My Pantry ({inventory.length})</span>
            </button>

            <button
              id="consumer-recommendations-btn"
              onClick={() => setCurrentPage('recommendations')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700/80 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kitchen Tips</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Avg Freshness</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {avgFreshness}
            </span>
            <span className="text-xs font-semibold text-slate-400">/100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated across pantry</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Fresh Items</span>
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {freshCount}
            </span>
            <span className="text-xs font-semibold text-slate-400">items</span>
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-semibold">Optimal condition</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Nearing Spoilage</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {atRiskCount}
            </span>
            <span className="text-xs font-semibold text-slate-400">items</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">Use within 48h</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total AI Scans</span>
            <ScanLine className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {analyses.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">evaluated</span>
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">All-time assessments</p>
        </div>
      </div>

      {/* Main Split: Expiring Soon Priority List & Recent Scans Carousel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Expiring Soon Priority Alert Box (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Shelf-Life Alerts ({expiringSoonItems.length})
              </h3>
            </div>
            <button
              onClick={() => setCurrentPage('inventory')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {expiringSoonItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
                <p>All items in your pantry have ample shelf life remaining!</p>
              </div>
            ) : (
              expiringSoonItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedInventoryId(item.id);
                    setCurrentPage('inventory-detail');
                  }}
                  className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-0.5">
                        {item.remainingDays <= 0 ? 'Expires today' : `${item.remainingDays} days left`} • Score {item.freshnessScore}/100
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
              ))
            )}
          </div>

          {/* Cooking Suggestion Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Zero-Waste Recipe Tip</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Combine expiring spinach and tomatoes in a quick Mediterranean vegetable sauté or freeze into smoothie portions.
            </p>
          </div>
        </div>

        {/* Recent AI Freshness Scans (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-emerald-500" />
              <span>Recent AI Scans</span>
            </h3>
            <button
              onClick={() => setCurrentPage('freshness')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Scan History
            </button>
          </div>

          <div className="space-y-3">
            {analyses.slice(0, 3).map((a) => (
              <div
                key={a.id}
                onClick={() => {
                  setSelectedAnalysisId(a.id);
                  setCurrentPage('analysis-detail');
                }}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img src={a.imageUrl} alt={a.foodName} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600">
                      {a.foodName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Category: {a.category} • Shelf life: {a.remainingShelfLifeDays}d remaining
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {a.freshnessScore}/100
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400">
                      {a.predictedClass}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage('analyze')}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Scan Another Food Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
