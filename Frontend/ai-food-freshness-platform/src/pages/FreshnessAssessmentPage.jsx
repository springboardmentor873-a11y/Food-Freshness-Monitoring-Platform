import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RadialGauge } from '../components/common/RadialGauge';
import { CategoryPieChart } from '../components/common/Charts';
import { Badge } from '../components/common/Badge';
import { Gauge, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const FreshnessAssessmentPage = () => {
  const breakdownData = [
    { name: 'Visual Condition (40%)', value: 40 },
    { name: 'Storage Conditions (25%)', value: 25 },
    { name: 'Shelf Life (20%)', value: 20 },
    { name: 'Product Age (15%)', value: 15 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Gauge className="w-7 h-7 text-emerald-400" /> Freshness Assessment Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Composite freshness scoring based on multimodal vision weights and environmental telemetry parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Radial Gauge & Overall Score */}
        <GlassCard className="lg:col-span-6 p-8 border-emerald-500/30 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Aggregate Freshness Score</span>
          </div>

          <div className="py-4">
            <RadialGauge value={92} size={220} strokeWidth={16} label="Overall Score" />
          </div>

          <div className="flex items-center justify-center space-x-3">
            <Badge status="FRESH" className="text-sm px-4 py-1">Grade: FRESH</Badge>
          </div>

          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Batch BATCH-2026-089 exceeds baseline freshness requirements by +14%. No immediate quarantine actions required.
          </p>
        </GlassCard>

        {/* Right Breakdown Donut & Weights */}
        <GlassCard className="lg:col-span-6 p-8 border-emerald-500/30 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" /> Score Breakdown Weights
          </h3>

          <CategoryPieChart data={breakdownData} />

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-emerald-400 font-bold block">Visual Condition (40%)</span>
              <span className="text-[11px] text-slate-400">Pixel color & skin compression</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-cyan-400 font-bold block">Storage Telemetry (25%)</span>
              <span className="text-[11px] text-slate-400">Temp & humidity compliance</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-lime-400 font-bold block">Remaining Shelf Life (20%)</span>
              <span className="text-[11px] text-slate-400">ML degradation curves</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-purple-400 font-bold block">Product Age (15%)</span>
              <span className="text-[11px] text-slate-400">Harvest to arrival days</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
