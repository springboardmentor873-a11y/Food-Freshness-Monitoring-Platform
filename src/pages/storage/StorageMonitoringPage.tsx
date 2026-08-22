import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  BellRing,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const StorageMonitoringPage: React.FC = () => {
  const { storageSensors, addToast } = useApp();
  const [selectedZoneId, setSelectedZoneId] = useState(storageSensors[0]?.id || 'sensor-1');

  const selectedSensor = storageSensors.find((s) => s.id === selectedZoneId) || storageSensors[0];

  // 24-hour hourly trend sample data
  const telemetryHistory = [
    { time: '00:00', temp: 2.1, humidity: 88, targetTemp: 2.0 },
    { time: '03:00', temp: 2.3, humidity: 89, targetTemp: 2.0 },
    { time: '06:00', temp: 2.8, humidity: 86, targetTemp: 2.0 },
    { time: '09:00', temp: 3.4, humidity: 84, targetTemp: 2.0 },
    { time: '12:00', temp: 3.9, humidity: 82, targetTemp: 2.0 },
    { time: '15:00', temp: 3.2, humidity: 85, targetTemp: 2.0 },
    { time: '18:00', temp: 2.7, humidity: 87, targetTemp: 2.0 },
    { time: '21:00', temp: 2.4, humidity: 88, targetTemp: 2.0 },
  ];

  const handleTestAlert = () => {
    addToast({
      type: 'warning',
      title: 'Climate Threshold Warning',
      message: `${selectedSensor.location} temperature excursion (+1.5°C over target). Automated chilling cycle initiated.`
    });
  };

  return (
    <div id="storage-monitoring-page" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Storage Environment & Climate Telemetry
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live multi-sensor telemetry tracking cold vault temperatures, relative humidity, and airflow compliance.
            </p>
          </div>
        </div>

        <button
          onClick={handleTestAlert}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-bold text-xs transition-colors shrink-0"
        >
          <BellRing className="w-4 h-4" />
          <span>Simulate Sensor Alert</span>
        </button>
      </div>

      {/* Sensor Zone Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {storageSensors.map((sensor) => {
          const isSelected = sensor.id === selectedZoneId;
          let statusBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          if (sensor.status === 'Warning') statusBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          if (sensor.status === 'Critical') statusBadge = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';

          return (
            <div
              key={sensor.id}
              onClick={() => setSelectedZoneId(sensor.id)}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {sensor.location}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sensor.zone}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge}`}>
                  {sensor.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-rose-500" />
                    <span>Temp</span>
                  </div>
                  <div className="font-black text-slate-800 dark:text-slate-100 mt-0.5">
                    {sensor.temperature}°C
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-500" />
                    <span>Humidity</span>
                  </div>
                  <div className="font-black text-slate-800 dark:text-slate-100 mt-0.5">
                    {sensor.humidity}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 24-Hour Telemetry Trend Chart & Zone Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                24-Hour Climate Telemetry ({selectedSensor.location})
              </h3>
              <p className="text-[11px] text-slate-400">Temperature & humidity fluctuations</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-rose-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Temp (°C)
              </span>
              <span className="flex items-center gap-1 text-cyan-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Humidity (%)
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={[0, 10]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[60, 100]} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#F43F5E" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Environmental Audit Diagnostics */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zone Compliance Status</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Compliance Index:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {selectedSensor.complianceScore}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Target Temp:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedSensor.targetTemp}°C (±1.0°C)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Target Humidity:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedSensor.targetHumidity}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Air Circulation:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedSensor.airCirculation}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Light Exposure:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedSensor.lightExposure}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300">
            <strong>Automated Regulation:</strong> HVAC PID feedback loop is maintaining air velocity and cooling within ISO food storage specifications.
          </div>
        </div>
      </div>
    </div>
  );
};
