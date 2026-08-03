import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { FreshnessAreaChart } from '../components/common/Charts';
import { Hourglass, Calendar, AlertTriangle, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShelfLifePredictionPage = () => {
  const forecastData = [
    { time: 'Day 1', freshness: 98, spoilageRisk: 2 },
    { time: 'Day 2', freshness: 94, spoilageRisk: 6 },
    { time: 'Day 3', freshness: 88, spoilageRisk: 12 },
    { time: 'Day 4', freshness: 81, spoilageRisk: 19 },
    { time: 'Day 5', freshness: 72, spoilageRisk: 28 },
    { time: 'Day 6', freshness: 58, spoilageRisk: 42 },
    { time: 'Day 7', freshness: 35, spoilageRisk: 65 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Hourglass className="w-7 h-7 text-cyan-400" /> AI Shelf Life Prediction Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Predictive degradation curves and risk meters forecasting remaining consumable days.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Remaining Days Hero Meter */}
        <GlassCard className="lg:col-span-5 p-8 border-cyan-500/30 text-center space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              Estimated Remaining Days
            </span>
            <div className="py-6">
              <span className="text-6xl font-extrabold text-white tracking-tight">5</span>
              <span className="text-2xl text-cyan-400 font-bold ml-2">Days</span>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Expected Expiry: Aug 4, 2026</span>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Prediction Risk Level</span>
              <span className="text-emerald-400 font-bold">Low Risk</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[25%]" />
            </div>
          </div>
        </GlassCard>

        {/* Right Forecast Chart & Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-white mb-4">7-Day Degradation Forecast Chart</h3>
            <FreshnessAreaChart data={forecastData} />
          </GlassCard>

          {/* Action Recommendations Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-4 border-emerald-500/30">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Rotate Inventory</span>
              </div>
              <p className="text-[11px] text-slate-300">Move older batches to front retail racks (FIFO).</p>
            </GlassCard>

            <GlassCard className="p-4 border-cyan-500/30">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Cold Storage Shift</span>
              </div>
              <p className="text-[11px] text-slate-300">Lower ambient temp by 1.2°C to gain +2 days.</p>
            </GlassCard>

            <GlassCard className="p-4 border-amber-500/30">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Clearance Markdown</span>
              </div>
              <p className="text-[11px] text-slate-300">Discount by 20% on Day 4 if unsold.</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};
