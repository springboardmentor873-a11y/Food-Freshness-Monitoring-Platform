import React from 'react';
import { FreshnessCategory, QualityScoreBreakdown } from '../../types';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

interface CircularScoreProps {
  score: number;
  category: FreshnessCategory;
  confidence: number;
  breakdown?: QualityScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
}

export const CircularScore: React.FC<CircularScoreProps> = ({
  score,
  category,
  confidence,
  breakdown,
  size = 'md',
  showBreakdown = true
}) => {
  // Determine color theme based on freshness category
  const getColorClass = () => {
    if (score >= 85) {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        stroke: '#10B981',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        icon: CheckCircle2
      };
    } else if (score >= 70) {
      return {
        text: 'text-teal-600 dark:text-teal-400',
        stroke: '#14B8A6',
        bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/50',
        badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 border-teal-300 dark:border-teal-700',
        icon: ShieldCheck
      };
    } else if (score >= 50) {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        stroke: '#F59E0B',
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        icon: AlertTriangle
      };
    } else if (score >= 35) {
      return {
        text: 'text-orange-600 dark:text-orange-400',
        stroke: '#F97316',
        bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/50',
        badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300 border-orange-300 dark:border-orange-700',
        icon: AlertTriangle
      };
    } else {
      return {
        text: 'text-rose-600 dark:text-rose-400',
        stroke: '#EF4444',
        bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 border-rose-300 dark:border-rose-700',
        icon: XCircle
      };
    }
  };

  const theme = getColorClass();
  const Icon = theme.icon;

  const radius = size === 'lg' ? 70 : size === 'md' ? 54 : 40;
  const strokeWidth = size === 'lg' ? 12 : size === 'md' ? 9 : 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const dimension = size === 'lg' ? 180 : size === 'md' ? 140 : 100;

  return (
    <div id="circular-score-component" className="flex flex-col items-center">
      {/* Circular Progress Gauge */}
      <div className="relative flex items-center justify-center">
        <svg 
          width={dimension} 
          height={dimension} 
          className="transform -rotate-90 drop-shadow-sm"
        >
          {/* Background Track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Active Animated Progress Arc */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-black tracking-tight leading-none ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl'} ${theme.text}`}>
            {score}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Freshness Badge & Confidence */}
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.badge}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{category}</span>
        </div>
        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Confidence: <span className="font-semibold text-slate-700 dark:text-slate-200">{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Score Breakdown (Conceptual Weighted Model) */}
      {showBreakdown && breakdown && (
        <div className="w-full mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-semibold mb-1">
            <span>Score Composition</span>
            <span className="text-[10px] text-slate-400 font-normal">Weighted Index</span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-500 dark:text-slate-400">Visual Condition (40%)</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{breakdown.visualCondition} / 40</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.visualCondition / 40) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-500 dark:text-slate-400">Storage Conditions (25%)</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{breakdown.storageCondition} / 25</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.storageCondition / 25) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-500 dark:text-slate-400">Shelf-Life Estimate (20%)</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{breakdown.shelfLifePrediction} / 20</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.shelfLifePrediction / 20) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-500 dark:text-slate-400">Product Age Index (15%)</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{breakdown.productAge} / 15</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${(breakdown.productAge / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
