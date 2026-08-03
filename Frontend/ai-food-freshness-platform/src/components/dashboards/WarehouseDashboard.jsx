import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { MOCK_TELEMETRY, MOCK_INVENTORY } from '../../constants/mockData';
import { Thermometer, Wind, Sun, ShieldAlert, Boxes, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WarehouseDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Telemetry Gauge Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-cyan-400" /> Temperature
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Optimal</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{MOCK_TELEMETRY.temperature.current}°C</span>
          <p className="text-[10px] text-slate-400 mt-1">Ideal Range: 2.0°C - 5.0°C</p>
        </GlassCard>

        <GlassCard className="p-4 border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-400" /> Humidity
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Optimal</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{MOCK_TELEMETRY.humidity.current}%</span>
          <p className="text-[10px] text-slate-400 mt-1">Ideal Range: 80% - 92%</p>
        </GlassCard>

        <GlassCard className="p-4 border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-lime-400" /> Airflow Rate
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Good</span>
          </div>
          <span className="text-3xl font-extrabold text-white">{MOCK_TELEMETRY.airCirculation.current} m/s</span>
          <p className="text-[10px] text-slate-400 mt-1">Target: 4.0 m/s</p>
        </GlassCard>

        <GlassCard className="p-4 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-amber-200 font-semibold uppercase flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> Light Exposure
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Warning</span>
          </div>
          <span className="text-3xl font-extrabold text-amber-300">{MOCK_TELEMETRY.lightExposure.current} lux</span>
          <p className="text-[10px] text-amber-300/80 mt-1">15 lux above threshold</p>
        </GlassCard>
      </div>

      {/* Warehouse Storage Zones */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Boxes className="w-4 h-4 text-emerald-400" /> Warehouse Cold Bays Health
          </h4>
          <Link to="/storage" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
            View Telemetry Page <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Cold Bay Alpha-1</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">120 kg Strawberries • 3.2°C</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[85%]" />
            </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Chiller Unit Delta</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">800 L Whole Milk • 2.8°C</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[92%]" />
            </div>
          </div>

          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-200">Ripening Room 2</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-[11px] text-rose-300">340 kg Avocado (Quarantined) • 18.5°C</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[42%]" />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
