import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { FreshnessAreaChart, SpoilageBarChart } from '../common/Charts';
import { MOCK_SYSTEM_HEALTH } from '../../constants/mockData';
import { Cpu, Users, Activity, HardDrive, ShieldCheck, Server, AlertTriangle } from 'lucide-react';

export const AdminDashboard = () => {
  const chartData = [
    { time: '00:00', freshness: 94, spoilageRisk: 4 },
    { time: '04:00', freshness: 92, spoilageRisk: 6 },
    { time: '08:00', freshness: 89, spoilageRisk: 8 },
    { time: '12:00', freshness: 95, spoilageRisk: 3 },
    { time: '16:00', freshness: 91, spoilageRisk: 7 },
    { time: '20:00', freshness: 93, spoilageRisk: 5 },
  ];

  const barData = [
    { category: 'Fruits', fresh: 142, warning: 18, spoiled: 4 },
    { category: 'Vegetables', fresh: 189, warning: 12, spoiled: 8 },
    { category: 'Dairy', fresh: 95, warning: 8, spoiled: 2 },
    { category: 'Seafood', fresh: 48, warning: 5, spoiled: 1 },
    { category: 'Bakery', fresh: 82, warning: 14, spoiled: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Admin KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Active Users</span>
            <span className="text-2xl font-extrabold text-white">{MOCK_SYSTEM_HEALTH.activeUsers}</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">API Response Latency</span>
            <span className="text-2xl font-extrabold text-white">{MOCK_SYSTEM_HEALTH.apiLatency}</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">AI Predictions Today</span>
            <span className="text-2xl font-extrabold text-white">{MOCK_SYSTEM_HEALTH.predictionRequestsToday}</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-lime-500/10 border border-lime-500/30 rounded-xl text-lime-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Storage Usage</span>
            <span className="text-2xl font-extrabold text-white">{MOCK_SYSTEM_HEALTH.storageUsage}</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Admin Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassCard className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">System Freshness & Anomaly Telemetry</h3>
              <p className="text-xs text-slate-400">Real-time aggregate platform prediction metrics</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Operational
            </span>
          </div>
          <FreshnessAreaChart data={chartData} />
        </GlassCard>

        <GlassCard className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Category Spoilage Breakdown</h3>
              <p className="text-xs text-slate-400">Distributed quality status across food groups</p>
            </div>
          </div>
          <SpoilageBarChart data={barData} />
        </GlassCard>
      </div>

      {/* System Health Status Panel */}
      <GlassCard className="p-6">
        <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" /> API Services Infrastructure & Microservices
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <span>FastAPI Inference Cluster</span>
            <span className="text-emerald-400 font-mono font-bold">99.99%</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <span>IoT MQTT Telemetry Gateway</span>
            <span className="text-emerald-400 font-mono font-bold">99.95%</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
            <span>PostgreSQL & Redis Cache</span>
            <span className="text-emerald-400 font-mono font-bold">100.0%</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
