import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RecommendationItem } from '../../types';
import { 
  Lightbulb, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  Clock, 
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap,
  Trash2,
  Check
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { 
    recommendations = [], 
    addToast, 
    setCurrentPage, 
    executeRecommendation, 
    dismissRecommendation 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = [
    'All',
    'Storage',
    'Consumption',
    'Inventory Rotation',
    'Waste Reduction',
    'Quality Improvement'
  ];

  const safeRecommendations = useMemo(() => {
    return Array.isArray(recommendations) ? recommendations : [];
  }, [recommendations]);

  const stats = useMemo(() => {
    const total = safeRecommendations.length;
    const critical = safeRecommendations.filter(
      (r) => r.priority === 'Critical' || r.priority === 'High' || r.priority === 'Urgent'
    ).length;
    const completed = safeRecommendations.filter((r) => r.implemented).length;
    const pending = total - completed;
    return { total, critical, completed, pending };
  }, [safeRecommendations]);

  const filteredRecommendations = useMemo(() => {
    return safeRecommendations.filter((r) => {
      const recCategory = r.category || 'Storage';
      const matchesCategory = 
        selectedCategory === 'All' || 
        recCategory === selectedCategory || 
        (r.type && r.type.toLowerCase().includes(selectedCategory.toLowerCase()));
      
      const matchesPriority = 
        selectedPriority === 'All' || 
        r.priority === selectedPriority ||
        (selectedPriority === 'High' && (r.priority === 'Critical' || r.priority === 'Urgent'));

      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'completed' && r.implemented) || 
        (statusFilter === 'pending' && !r.implemented);

      return matchesCategory && matchesPriority && matchesStatus;
    });
  }, [safeRecommendations, selectedCategory, selectedPriority, statusFilter]);

  const handleExecuteAction = (rec: RecommendationItem) => {
    if (executeRecommendation) {
      executeRecommendation(rec.id);
    }
    addToast({
      type: 'success',
      title: 'Action Executed',
      message: `Executed: "${rec.actionText}" for ${rec.title}.`
    });
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dismissRecommendation) {
      dismissRecommendation(id);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        type: 'info',
        title: 'Prescriptive Engine Refreshed',
        message: 'AI heuristics re-evaluated sensor telemetry and inventory expiration horizons.'
      });
    }, 600);
  };

  return (
    <div id="recommendations-hub-page" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Prescriptive Quality & Waste Optimization
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                AI Heuristics Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Actionable operational directives to prevent shrinkage, regulate storage atmospheres, and prioritize kitchen & retail turnover.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors shrink-0 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
            <span>{isRefreshing ? 'Re-evaluating...' : 'Refresh Heuristics'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Directives</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {stats.pending} <span className="text-xs font-semibold text-slate-400">pending</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{stats.total} total generated</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Critical / Urgent</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">
            {stats.critical} <span className="text-xs font-semibold text-slate-400">actions</span>
          </div>
          <p className="text-[11px] text-rose-500/80 font-semibold mt-0.5">Immediate intervention</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Executed Actions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats.completed} <span className="text-xs font-semibold text-slate-400">applied</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Shrinkage prevented</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Resolution Velocity</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 100}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Implementation rate</p>
        </div>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({safeRecommendations.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                statusFilter === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecommendations.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching directives found
            </h4>
            <p className="max-w-md mx-auto text-slate-500">
              All inventory batches and climate zones currently adhere to optimal freshness standards under selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPriority('All');
                setStatusFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredRecommendations.map((rec) => {
            const isCompleted = Boolean(rec.implemented);

            let priorityBadge = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
            if (rec.priority === 'High' || rec.priority === 'Critical' || rec.priority === 'Urgent') {
              priorityBadge = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
            } else if (rec.priority === 'Medium') {
              priorityBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            }

            return (
              <div
                key={rec.id}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                  isCompleted 
                    ? 'border-emerald-200 dark:border-emerald-900/60 opacity-80' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {rec.category || 'Optimization'}
                        </span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3" /> Implemented
                          </span>
                        )}
                      </div>
                      <h3 className={`text-sm font-bold mt-1 ${isCompleted ? 'text-slate-600 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                        {rec.title}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${priorityBadge} shrink-0`}>
                      {rec.priority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rec.reason}
                  </p>

                  <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      Expected Impact:
                    </span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">
                      {rec.expectedImpact}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Category: <strong className="text-slate-600 dark:text-slate-300">{rec.category}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleDismiss(rec.id, e)}
                      title="Dismiss directive"
                      className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {isCompleted ? (
                      <button
                        onClick={() => handleExecuteAction(rec)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Completed</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleExecuteAction(rec)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
                      >
                        <span>{rec.actionText || 'Execute Directive'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
