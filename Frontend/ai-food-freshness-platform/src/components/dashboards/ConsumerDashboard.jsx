import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { MOCK_INVENTORY } from '../../constants/mockData';
import { Sparkles, Utensils, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ConsumerDashboard = () => {
  const nearExpiry = MOCK_INVENTORY.filter((item) => item.shelfLifeDays <= 2);

  return (
    <div className="space-y-6">
      {/* Consumer Banner */}
      <GlassCard className="p-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border-emerald-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" /> Consumer Household Fresh Basket
            </h3>
            <p className="text-xs text-slate-300">
              Track your home grocery items, receive early spoilage warnings, and minimize kitchen food waste.
            </p>
          </div>
          <Link to="/analysis" className="shrink-0">
            <button className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors">
              Scan Food Photo
            </button>
          </Link>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consume First Priority Box */}
        <GlassCard className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Consume Immediately Priority
            </h4>
            <span className="text-xs text-slate-400">{nearExpiry.length} items at risk</span>
          </div>

          <div className="space-y-3">
            {nearExpiry.map((item) => (
              <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h5 className="text-sm font-semibold text-white">{item.name}</h5>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Expiring in {item.shelfLifeDays} Days
                    </span>
                  </div>
                </div>
                <Badge status={item.status} />
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Freshness Stats */}
        <GlassCard className="space-y-4 text-center flex flex-col justify-center">
          <Utensils className="w-10 h-10 text-emerald-400 mx-auto" />
          <div>
            <span className="text-3xl font-extrabold text-white">88%</span>
            <p className="text-xs text-slate-400 mt-1">Average Household Freshness Index</p>
          </div>
          <div className="pt-3 border-t border-white/10 text-xs text-slate-300 space-y-1">
            <p>5 Active Fresh Items</p>
            <p className="text-emerald-400">0% Spoilage Rate This Month</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
