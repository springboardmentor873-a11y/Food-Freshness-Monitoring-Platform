import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { USER_ROLES, MOCK_INVENTORY } from '../constants/mockData';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { ConsumerDashboard } from '../components/dashboards/ConsumerDashboard';
import { RetailDashboard } from '../components/dashboards/RetailDashboard';
import { WarehouseDashboard } from '../components/dashboards/WarehouseDashboard';
import { InspectorDashboard } from '../components/dashboards/InspectorDashboard';
import {
  Boxes,
  Gauge,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Camera,
  PlusCircle,
  FileText,
  Bell,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  const totalMonitored = MOCK_INVENTORY.length;
  const avgFreshness = Math.round(
    MOCK_INVENTORY.reduce((acc, curr) => acc + curr.freshnessScore, 0) / totalMonitored
  );
  const nearExpiryCount = MOCK_INVENTORY.filter((item) => item.shelfLifeDays <= 2).length;
  const spoiledCount = MOCK_INVENTORY.filter((item) => item.status === 'SPOILED').length;

  const renderRoleDashboard = () => {
    switch (user?.role) {
      case USER_ROLES.ADMINISTRATOR:
        return <AdminDashboard />;
      case USER_ROLES.CONSUMER:
        return <ConsumerDashboard />;
      case USER_ROLES.RETAIL_MANAGER:
        return <RetailDashboard />;
      case USER_ROLES.WAREHOUSE_OPERATOR:
        return <WarehouseDashboard />;
      case USER_ROLES.QUALITY_INSPECTOR:
        return <InspectorDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar & Role Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Role: {user?.role || 'Administrator'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name || 'Architect'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time food freshness analytics, spoilage predictions, and storage telemetry.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/analysis">
            <button className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all">
              <Camera className="w-4 h-4" />
              <span>AI Scan Photo</span>
            </button>
          </Link>
          <Link to="/inventory">
            <button className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-xs rounded-xl transition-all">
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Add Food Batch</span>
            </button>
          </Link>
          <Link to="/reports">
            <button className="flex items-center space-x-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-xs rounded-xl transition-all">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Generate Audit Report</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
            <Boxes className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Foods Monitored
            </span>
            <span className="text-2xl font-extrabold text-white">{totalMonitored} Active Batches</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +12.4% this week
            </span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
            <Gauge className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Average Freshness
            </span>
            <span className="text-2xl font-extrabold text-white">{avgFreshness}% Score</span>
            <span className="text-[10px] text-cyan-400 font-mono mt-0.5 block">High Quality Grade</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Near Expiry Warning
            </span>
            <span className="text-2xl font-extrabold text-amber-300">{nearExpiryCount} Items</span>
            <span className="text-[10px] text-amber-300/80 mt-0.5 block">Action required &lt;48h</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quarantined / Spoiled
            </span>
            <span className="text-2xl font-extrabold text-rose-300">{spoiledCount} Item</span>
            <span className="text-[10px] text-rose-400 mt-0.5 block">Auto-isolated in Room 2</span>
          </div>
        </GlassCard>
      </div>

      {/* AI Recommendation Floating Card */}
      <GlassCard className="p-6 bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent border-emerald-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-500/40 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">AI Spoilage Prevention Recommendation</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
                  High Confidence (98.4%)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Batch <span className="font-mono text-emerald-300">BATCH-2026-092 (Strawberries)</span> in Cold Bay Alpha-1 shows rapid humidity drift. Move to Cold Zone 1 to extend shelf-life by +3 days.
              </p>
            </div>
          </div>
          <Link to="/storage">
            <button className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors shrink-0">
              Apply AI Adjustment
            </button>
          </Link>
        </div>
      </GlassCard>

      {/* Role-tailored dynamic view */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Tailored Role Dashboard</span>
            <span className="text-xs text-slate-400 font-normal">({user?.role})</span>
          </h2>
        </div>
        {renderRoleDashboard()}
      </div>
    </div>
  );
};
