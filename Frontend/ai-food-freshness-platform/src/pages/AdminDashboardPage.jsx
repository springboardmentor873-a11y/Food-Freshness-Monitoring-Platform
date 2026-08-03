import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { ShieldCheck, Users, Server, Activity, Lock } from 'lucide-react';

export const AdminDashboardPage = () => {
  const auditLogs = [
    { id: 'LOG-4091', action: 'Role Shift: Dr. Sarah Vance -> Administrator', user: 'System Admin', time: '12 mins ago' },
    { id: 'LOG-4090', action: 'FastAPI Inference API Threshold Calibrated', user: 'AI Engine Ops', time: '42 mins ago' },
    { id: 'LOG-4089', action: 'Batch BATCH-2026-074 Auto-Quarantined', user: 'Quality Bot', time: '2 hours ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-400" /> Platform Administrator Console
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Global system health, active user roles, API throughput, and audit logs.
        </p>
      </div>

      <AdminDashboard />

      {/* Audit Logs Table */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" /> System Audit & Security Logs
        </h3>

        <div className="space-y-2 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between font-mono">
              <div>
                <span className="text-emerald-400 font-bold mr-2">[{log.id}]</span>
                <span className="text-slate-200">{log.action}</span>
              </div>
              <div className="text-right text-slate-400 text-[10px]">
                <span>{log.user} • {log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
