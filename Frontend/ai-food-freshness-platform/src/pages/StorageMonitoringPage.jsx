import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MOCK_TELEMETRY } from '../constants/mockData';
import { Thermometer, Wind, Sun, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export const StorageMonitoringPage = () => {
  const telemetry = [
    {
      title: 'Storage Temperature',
      icon: Thermometer,
      current: `${MOCK_TELEMETRY.temperature.current} °C`,
      ideal: '2.0°C - 5.0°C',
      status: 'Optimal',
      color: 'emerald',
      desc: 'Compressors performing within 99.8% thermal stability tolerance.',
    },
    {
      title: 'Relative Humidity',
      icon: Wind,
      current: `${MOCK_TELEMETRY.humidity.current} %`,
      ideal: '80.0% - 92.0%',
      status: 'Optimal',
      color: 'emerald',
      desc: 'Moisture barrier active; zero condensation risk detected.',
    },
    {
      title: 'Air Circulation Speed',
      icon: Wind,
      current: `${MOCK_TELEMETRY.airCirculation.current} m/s`,
      ideal: '3.0 - 5.0 m/s',
      status: 'Good',
      color: 'emerald',
      desc: 'Ventilation fans maintaining uniform airflow distribution.',
    },
    {
      title: 'Ambient Light Exposure',
      icon: Sun,
      current: `${MOCK_TELEMETRY.lightExposure.current} lux`,
      ideal: '10 - 30 lux',
      status: 'Warning',
      color: 'amber',
      desc: 'Light levels elevated by +15 lux in Cold Bay Alpha-2.',
    },
    {
      title: 'Storage Duration',
      icon: Clock,
      current: `${MOCK_TELEMETRY.storageDuration.current} Days`,
      ideal: 'Max 7.0 Days',
      status: 'Safe',
      color: 'emerald',
      desc: 'Current batch age well within maximum storage threshold.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Thermometer className="w-7 h-7 text-cyan-400" /> Storage Monitoring Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Real-time cold-chain environmental sensors streaming temperature, humidity, airflow, and light levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {telemetry.map((item, idx) => {
          const Icon = item.icon;
          const isWarning = item.color === 'amber';
          return (
            <GlassCard
              key={idx}
              className={`p-6 space-y-4 ${
                isWarning ? 'border-amber-500/40 bg-amber-500/5' : 'border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isWarning
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <span className="text-3xl font-extrabold text-white">{item.current}</span>
                <span className="text-xs text-slate-400 block mt-0.5">Ideal Range: {item.ideal}</span>
              </div>

              <p className="text-xs text-slate-300 border-t border-white/10 pt-3">{item.desc}</p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
