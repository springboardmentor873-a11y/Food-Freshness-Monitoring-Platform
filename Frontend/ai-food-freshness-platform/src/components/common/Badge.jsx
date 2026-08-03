import React from 'react';
import clsx from 'clsx';
import { FRESHNESS_GRADES } from '../../constants/mockData';

export const Badge = ({ status = 'FRESH', children, className }) => {
  const grade = FRESHNESS_GRADES[status] || {
    label: children || status,
    bgClass: 'bg-white/10 text-slate-300 border-white/10',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all',
        grade.bgClass,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {children || grade.label}
    </span>
  );
};
