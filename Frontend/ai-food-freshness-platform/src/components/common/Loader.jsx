import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, AlertCircle, Inbox } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const AILoader = ({ text = 'AI Freshness Engine Analyzing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-cyan-400/50"
        />
        <Cpu className="w-8 h-8 text-emerald-400 animate-pulse" />
      </div>
      <p className="text-sm font-semibold text-slate-300 tracking-wide animate-pulse">{text}</p>
    </div>
  );
};

export const EmptyState = ({ title = 'No Items Found', description = 'No food items match your criteria.', onAction, actionLabel = 'Reset Filters' }) => {
  return (
    <GlassCard className="flex flex-col items-center justify-center p-12 text-center my-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
        <Inbox className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-100 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </GlassCard>
  );
};

export const ErrorState = ({ message = 'Failed to load telemetry data.', onRetry }) => {
  return (
    <GlassCard className="flex flex-col items-center justify-center p-8 text-center border-rose-500/30 bg-rose-500/5 my-4">
      <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
      <h4 className="text-base font-bold text-rose-200 mb-1">Execution Warning</h4>
      <p className="text-xs text-rose-300/80 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold hover:bg-rose-500/30"
        >
          Try Again
        </button>
      )}
    </GlassCard>
  );
};
