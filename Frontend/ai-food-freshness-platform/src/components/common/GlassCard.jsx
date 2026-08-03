import React from 'react';
import clsx from 'clsx';

export const GlassCard = ({ children, className, hover = true, glow = false, ...props }) => {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 shadow-2xl transition-all duration-300',
        hover && 'hover:bg-white/[0.07] hover:border-emerald-500/30 hover:shadow-emerald-500/10 hover:-translate-y-1',
        glow && 'before:absolute before:inset-0 before:-z-10 before:bg-gradient-radial before:from-emerald-500/20 before:to-transparent before:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
