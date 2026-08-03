import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { MOCK_INVENTORY } from '../../constants/mockData';
import { Store, Tag, TrendingDown, DollarSign, ArrowUpRight } from 'lucide-react';

export const RetailDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Store Shelf Quality</span>
            <span className="text-2xl font-extrabold text-white">94.2%</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Shrinkage Reduction</span>
            <span className="text-2xl font-extrabold text-white">-41.5%</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Clearance Markdown Queue</span>
            <span className="text-2xl font-extrabold text-white">4 Batches</span>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-cyan-400" /> Automated Markdown Recommendations
          </h4>
          <span className="text-xs text-slate-400">Dynamic Pricing to Eliminate Waste</span>
        </div>

        <div className="space-y-3">
          {MOCK_INVENTORY.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h5 className="text-sm font-semibold text-white">{item.name}</h5>
                  <span className="text-xs text-slate-400">{item.batchId} • {item.warehouse}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-bold block">Apply 30% Discount</span>
                  <span className="text-[10px] text-slate-400">Expiring in {item.shelfLifeDays} days</span>
                </div>
                <button className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold hover:bg-emerald-500/30">
                  Approve Markdown
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
