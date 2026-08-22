import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  TrendingUp, 
  AlertTriangle, 
  RotateCcw, 
  DollarSign, 
  Package, 
  ArrowRight,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export const RetailDashboard: React.FC = () => {
  const { inventory, setCurrentPage, setSelectedInventoryId } = useApp();

  const totalQuantityKg = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const expiringSoon = inventory.filter((i) => i.status === 'Expiring Soon' || i.status === 'Critical');
  const freshItems = inventory.filter((i) => i.freshnessCategory === 'Fresh' || i.freshnessCategory === 'Good');

  const chartData = [
    { name: 'Fresh (85-100)', count: inventory.filter(i => i.freshnessScore >= 85).length, color: '#10B981' },
    { name: 'Good (70-84)', count: inventory.filter(i => i.freshnessScore >= 70 && i.freshnessScore < 85).length, color: '#14B8A6' },
    { name: 'Acceptable (50-69)', count: inventory.filter(i => i.freshnessScore >= 50 && i.freshnessScore < 70).length, color: '#F59E0B' },
    { name: 'Near Spoilage (30-49)', count: inventory.filter(i => i.freshnessScore >= 30 && i.freshnessScore < 50).length, color: '#F97316' },
    { name: 'Critical (<30)', count: inventory.filter(i => i.freshnessScore < 30).length, color: '#EF4444' }
  ];

  return (
    <div id="retail-dashboard" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Store className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Retail Store Freshness Monitor
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                GreenMart Supermarket Branch #104 • Live Stock Quality & FIFO Rotation
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('recommendations')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Generate FIFO Rotation Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Produce Stock</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalQuantityKg} <span className="text-xs font-semibold text-slate-400">units/kg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{inventory.length} distinct product batches</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Fresh Index Ratio</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {Math.round((freshItems.length / inventory.length) * 100)}%
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Tier-1 display quality</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Expiring in &le; 48h</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {expiringSoon.length} <span className="text-xs font-semibold text-slate-400">batches</span>
          </div>
          <p className="text-[11px] text-amber-600 mt-1 font-semibold">Mark-down or sample push</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Shrink / Waste Saved</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
            $1,840
          </div>
          <p className="text-[11px] text-teal-600 mt-1 font-semibold">+18.4% FIFO optimization</p>
        </div>
      </div>

      {/* Charts & Urgent Action Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Freshness Distribution Chart (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Current Inventory Freshness Distribution
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Rotation Queue (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Recommended Inventory Rotation Queue</span>
            </h3>
          </div>

          <div className="space-y-3">
            {expiringSoon.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedInventoryId(item.id);
                  setCurrentPage('inventory-detail');
                }}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {item.name} ({item.batchId})
                    </div>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                      {item.remainingDays <= 0 ? 'Expires Today' : `${item.remainingDays} days shelf life`} • {item.quantity} {item.unit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Front Display 30% Promo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
