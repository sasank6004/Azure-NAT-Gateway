import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-8 bg-slate-800/60 rounded-lg w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-800/40 rounded-xl border border-slate-700/30" />
        ))}
      </div>
      <div className="h-64 bg-slate-800/40 rounded-xl border border-slate-700/30" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-800/30 rounded-lg" />
      ))}
    </div>
  );
};
