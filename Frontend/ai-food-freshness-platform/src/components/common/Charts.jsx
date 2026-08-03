import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0c1e33] border border-white/20 p-3 rounded-xl shadow-2xl backdrop-blur-xl text-xs space-y-1">
        <p className="text-slate-300 font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.name}: </span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const FreshnessAreaChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
        <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="freshness" name="Avg Freshness %" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#emeraldGrad)" />
        <Area type="monotone" dataKey="spoilageRisk" name="Spoilage Risk %" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#cyanGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const CategoryPieChart = ({ data }) => {
  const COLORS = ['#10B981', '#06B6D4', '#84CC16', '#F59E0B', '#3B82F6', '#EC4899'];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(7, 17, 31, 0.8)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const SpoilageBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
        <YAxis stroke="#94a3b8" fontSize={11} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="fresh" name="Fresh Items" fill="#10B981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="warning" name="Near Expiry" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        <Bar dataKey="spoiled" name="Spoiled" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
