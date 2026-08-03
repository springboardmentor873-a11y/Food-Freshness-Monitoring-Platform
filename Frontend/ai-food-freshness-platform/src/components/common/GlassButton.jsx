import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export const GlassButton = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  loading = false,
  disabled = false,
  className,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-emerald-500 border border-emerald-400/30',
    secondary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-cyan-500 border border-cyan-400/30',
    danger: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 border border-rose-400/30',
    outline: 'bg-white/5 text-slate-200 border border-white/15 hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400 shadow-md',
    ghost: 'text-slate-300 hover:text-emerald-400 hover:bg-white/5',
  };

  return (
    <button
      className={clsx(baseStyles, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
