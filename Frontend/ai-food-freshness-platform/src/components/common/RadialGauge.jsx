import React from 'react';
import { motion } from 'framer-motion';

export const RadialGauge = ({ value = 88, size = 180, strokeWidth = 14, label = 'Freshness Score' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let colorClass = '#10B981'; // Emerald
  if (value < 50) colorClass = '#EF4444'; // Red
  else if (value < 75) colorClass = '#F59E0B'; // Amber
  else if (value < 85) colorClass = '#84CC16'; // Lime

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Gauge path */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
          style={{ filter: `drop-shadow(0px 0px 10px ${colorClass}66)` }}
        />
      </svg>
      {/* Inner Score Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-4xl font-extrabold text-white tracking-tight">{value}%</span>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
          {label}
        </span>
      </div>
    </div>
  );
};
