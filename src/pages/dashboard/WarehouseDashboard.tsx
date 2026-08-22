import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export const WarehouseDashboard: React.FC = () => {
  const { storageSensors, setCurrentPage } = useApp();

  const avgCompliance = Math.round(
    storageSensors.reduce((acc, curr) => acc + curr.complianceScore, 0) / storageSensors.length
  );
  const criticalSensors = storageSensors.filter((s) => s.status === 'Critical' || s.status === 'Warning');

  return (
    <div id="warehouse-dashboard" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Warehouse Cold Chain & Storage Health
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pacific Cold Chain Logistics Hub • Facility #02 • 4 Monitored Zones
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('storage')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
        >
          <Thermometer className="w-4 h-4" />
          <span>Full Sensor Telemetry</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Overall Climate Compliance</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {avgCompliance}%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">ISO 22000 Food Safety compliant</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Active Sensors</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {storageSensors.length} / {storageSensors.length}
          </div>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">100% online & transmitting</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Climate Violations</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {criticalSensors.length} <span className="text-xs font-semibold text-slate-400">zones</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Staging dock & Backroom</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Avg Cold Vault Temp</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            2.3°C
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target range: 1.5°C - 3.5°C</p>
        </div>
      </div>

      {/* Real-time Storage Climate Matrix */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Active Storage Zones & Environmental Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storageSensors.map((sensor) => {
            let statusBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            if (sensor.status === 'Warning') statusBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            if (sensor.status === 'Critical') statusBadge = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

            return (
              <div
                key={sensor.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {sensor.location}
                    </h4>
                    <p className="text-[11px] text-slate-500">{sensor.zone}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadge}`}>
                    {sensor.status} ({sensor.complianceScore}%)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-semibold">
                      <Thermometer className="w-3 h-3 text-rose-500" />
                      <span>Temp</span>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                      {sensor.temperature}°C
                    </div>
                    <div className="text-[9px] text-slate-400">Target: {sensor.targetTemp}°C</div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-semibold">
                      <Droplets className="w-3 h-3 text-cyan-500" />
                      <span>Humidity</span>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                      {sensor.humidity}%
                    </div>
                    <div className="text-[9px] text-slate-400">Target: {sensor.targetHumidity}%</div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-semibold">
                      <Wind className="w-3 h-3 text-teal-500" />
                      <span>Air Flow</span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {sensor.airCirculation}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-semibold">
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>Light</span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {sensor.lightExposure}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
