import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { MOCK_INVENTORY } from '../../constants/mockData';
import { ClipboardCheck, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InspectorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Pending Inspections</span>
            <span className="text-2xl font-extrabold text-white">3 Batches</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Failed Spoilage Thresholds</span>
            <span className="text-2xl font-extrabold text-white">1 Quarantine</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Verified Certified Batches</span>
            <span className="text-2xl font-extrabold text-white">142 Batches</span>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-emerald-400" /> Active Inspection Verification Queue
          </h4>
          <Link to="/analysis" className="text-xs text-emerald-400 hover:underline">Run AI Scan</Link>
        </div>

        <div className="space-y-3">
          {MOCK_INVENTORY.slice(0, 4).map((item) => (
            <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h5 className="text-sm font-semibold text-white">{item.name}</h5>
                  <span className="text-xs text-slate-400">{item.batchId} • Supplier: {item.supplier}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge status={item.status} />
                <button className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold hover:bg-emerald-500/30">
                  Verify Quality
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
