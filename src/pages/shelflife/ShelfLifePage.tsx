import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Thermometer, 
  Droplets, 
  Package, 
  Sparkles, 
  Calendar, 
  AlertTriangle, 
  ArrowRight,
  TrendingDown,
  Info,
  ShieldCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export const ShelfLifePage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const [selectedFood, setSelectedFood] = useState('Fresh Organic Spinach');
  const [temperature, setTemperature] = useState(4);
  const [humidity, setHumidity] = useState(85);
  const [packaging, setPackaging] = useState('Perforated Polybags');
  const [storedDays, setStoredDays] = useState(2);

  // Dynamic decay calculation based on Arrhenius Q10 approximation
  const prediction = useMemo(() => {
    // Base shelf life at optimal temp (4°C)
    let baseShelfLife = 10;
    let optimalTemp = 4;
    let optimalHumidity = 90;

    if (selectedFood.includes('Spinach') || selectedFood.includes('Lettuce')) {
      baseShelfLife = 10;
      optimalTemp = 2;
      optimalHumidity = 95;
    } else if (selectedFood.includes('Strawberry') || selectedFood.includes('Berries')) {
      baseShelfLife = 7;
      optimalTemp = 1;
      optimalHumidity = 90;
    } else if (selectedFood.includes('Tomato')) {
      baseShelfLife = 14;
      optimalTemp = 12;
      optimalHumidity = 85;
    } else if (selectedFood.includes('Apple')) {
      baseShelfLife = 30;
      optimalTemp = 3;
      optimalHumidity = 90;
    } else if (selectedFood.includes('Milk') || selectedFood.includes('Dairy')) {
      baseShelfLife = 12;
      optimalTemp = 3;
      optimalHumidity = 65;
    } else if (selectedFood.includes('Avocado')) {
      baseShelfLife = 9;
      optimalTemp = 7;
      optimalHumidity = 85;
    }

    // Packaging modifier
    let packMultiplier = 1.0;
    if (packaging === 'Vacuum Sealed') packMultiplier = 1.6;
    if (packaging === 'Controlled Atmosphere') packMultiplier = 2.0;
    if (packaging === 'Open Mesh / Unpackaged') packMultiplier = 0.6;

    // Temperature degradation factor (Q10 = 2.2 per 10°C above optimal)
    const tempDiff = Math.max(0, temperature - optimalTemp);
    const tempFactor = Math.pow(2.0, tempDiff / 10);

    // Humidity penalty factor
    const humidityDiff = Math.abs(humidity - optimalHumidity);
    const humidityFactor = 1 - (humidityDiff / 100) * 0.4;

    const totalDaysEffective = Math.max(
      1,
      Math.round((baseShelfLife * packMultiplier * humidityFactor) / tempFactor)
    );
    const remainingDays = Math.max(0, totalDaysEffective - storedDays);

    // Expiry date calculation
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + remainingDays);

    // Generate daily decay curve data for chart
    const decayCurve = [];
    const totalDaysToSimulate = Math.max(10, totalDaysEffective + 3);
    for (let day = 0; day <= totalDaysToSimulate; day++) {
      const score = Math.max(
        0,
        Math.round(100 * Math.exp((-1.5 * day) / totalDaysEffective))
      );
      decayCurve.push({
        day: `Day ${day}`,
        dayNum: day,
        score,
        threshold: 40 // Near Spoilage threshold
      });
    }

    return {
      totalDaysEffective,
      remainingDays,
      expiryDate: expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      decayCurve,
      riskLevel: remainingDays > 4 ? 'Low' : remainingDays > 1 ? 'Moderate' : 'High'
    };
  }, [selectedFood, temperature, humidity, packaging, storedDays]);

  return (
    <div id="shelf-life-predictor-page" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Clock className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              AI Shelf-Life Simulator & Biochemical Decay Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive thermodynamic simulator modeling respiration rates and microbial degradation kinetics.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('analyze')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze from Photo</span>
        </button>
      </div>

      {/* Simulator Grid: Controls on Left, Realtime Decay Curve on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Card (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Simulation Parameters</span>
          </h3>

          {/* Food Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Produce Variety
            </label>
            <select
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Fresh Organic Spinach">Fresh Organic Spinach (Leafy Greens)</option>
              <option value="Sweet Strawberries">Sweet Strawberries (Berry / High Respiration)</option>
              <option value="Vine-Ripened Tomatoes">Vine-Ripened Tomatoes (Solanaceae)</option>
              <option value="Crisp Gala Apples">Crisp Gala Apples (Pome Fruit)</option>
              <option value="Whole Pasteurized Milk">Whole Pasteurized Milk (Dairy)</option>
              <option value="Hass Avocados">Hass Avocados (Climacteric Fruit)</option>
            </select>
          </div>

          {/* Storage Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>Storage Temperature</span>
              </span>
              <span className="font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                {temperature}°C
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0°C (Cold Vault)</span>
              <span>10°C (Chilled)</span>
              <span>25°C (Ambient Room)</span>
            </div>
          </div>

          {/* Relative Humidity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                <span>Relative Humidity</span>
              </span>
              <span className="font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded-md">
                {humidity}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              step="5"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>40% (Dry Air)</span>
              <span>75% (Standard)</span>
              <span>95% (High Moisture)</span>
            </div>
          </div>

          {/* Days Already Stored Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Elapsed Post-Harvest Days</span>
              </span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                {storedDays} Days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={storedDays}
              onChange={(e) => setStoredDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Packaging Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Packaging & Atmosphere Barrier
            </label>
            <select
              value={packaging}
              onChange={(e) => setPackaging(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
            >
              <option value="Open Mesh / Unpackaged">Open Mesh / Unpackaged</option>
              <option value="Perforated Polybags">Perforated Polybags (Standard)</option>
              <option value="Vacuum Sealed">Vacuum Sealed (Barrier Film)</option>
              <option value="Controlled Atmosphere">Controlled Atmosphere (Low O2 / High CO2)</option>
            </select>
          </div>
        </div>

        {/* Prediction Results & Dynamic Decay Curve (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Projected KPI Highlights */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/20 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Projected Shelf-Life Result
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                prediction.riskLevel === 'Low'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : prediction.riskLevel === 'Moderate'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                Risk: {prediction.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
                    {prediction.remainingDays}
                  </span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    Days Remaining
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Estimated Total Longevity: {prediction.totalDaysEffective} days
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="text-slate-400 flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Projected Expiration Date:</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {prediction.expiryDate}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Decay Curve Recharts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-cyan-500" />
                <span>Simulated Quality Decay Curve</span>
              </h3>
              <span className="text-[11px] text-slate-400">Score vs Storage Days</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prediction.decayCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <ReferenceLine y={40} label={{ value: 'Spoilage Line', fill: '#EF4444', fontSize: 10 }} stroke="#EF4444" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#10B981' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
