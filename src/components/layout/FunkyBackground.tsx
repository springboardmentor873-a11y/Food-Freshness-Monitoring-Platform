import React from 'react';

export const FunkyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle Mesh Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Floating Soft Ambient Blobs */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-3xl animate-pulse" 
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-teal-400/10 dark:bg-teal-600/10 blur-3xl animate-pulse" 
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      />
      <div 
        className="absolute -bottom-40 left-1/3 w-[26rem] h-[26rem] rounded-full bg-lime-400/10 dark:bg-lime-600/10 blur-3xl animate-pulse" 
        style={{ animationDuration: '10s', animationDelay: '4s' }}
      />
      
      {/* Subtle AI Scanline accent at the top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
    </div>
  );
};
