import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Leaf, 
  DollarSign, 
  Calendar, 
  Download,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { analyses, inventory, addToast } = useApp();
  const [timeRange, setTimeRange] = useState('30d');

  // Sample historical data points
  const freshnessTrendData = [
    { date: 'Week 1', avgScore: 84, wasteKg: 18, savedKg: 42 },
    { date: 'Week 2', avgScore: 87, wasteKg: 14, savedKg: 58 },
    { date: 'Week 3', avgScore: 91, wasteKg: 9, savedKg: 75 },
    { date: 'Week 4', avgScore: 94, wasteKg: 5, savedKg: 92 },
  ];

  const categoryPerformanceData = [
    { category: 'Vegetables', avgFreshness: 89, totalVolume: 120 },
    { category: 'Fruits', avgFreshness: 86, totalVolume: 85 },
    { category: 'Dairy', avgFreshness: 94, totalVolume: 40 },
    { category: 'Bakery', avgFreshness: 82, totalVolume: 25 },
    { category: 'Meat & Seafood', avgFreshness: 95, totalVolume: 50 },
  ];

  const handleExportData = () => {
    addToast({
      type: 'success',
      title: 'Analytics Exported',
      message: 'Exported historical freshness and waste metrics as CSV.'
    });
  };

  return (
    <div id="analytics-dashboard-page" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Food Freshness & Sustainability Analytics
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Macro-level quality trends, spoilage reduction rates, and environmental ESG impact metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">Last 12 Months</option>
          </select>

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Average Quality Index</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            91.4%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+6.2% vs previous period</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Food Waste Diverted</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
            267 <span className="text-xs font-semibold text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Via FIFO and proactive alerts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Financial Loss Prevented</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            $2,480
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated inventory savings</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">CO2 Equivalent Saved</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            640 <span className="text-xs font-semibold text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">Avoided landfill methane</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waste Reduction & Freshness Score Trend (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Freshness Evolution & Waste Averted
              </h3>
              <p className="text-[11px] text-slate-400">Weekly progression metrics</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Score
              </span>
              <span className="flex items-center gap-1 text-teal-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-500" /> Saved (kg)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={freshnessTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="savedKg" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="avgScore" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Category Freshness Index
              </h3>
              <p className="text-[11px] text-slate-400">Mean quality across produce lines</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformanceData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} width={75} />
                <Tooltip />
                <Bar dataKey="avgFreshness" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
