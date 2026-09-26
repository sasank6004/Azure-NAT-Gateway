import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showPulse = true,
}) => {
  const norm = status.toLowerCase();

  let colorClass = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
  let dotClass = 'bg-slate-400';
  let glowClass = '';

  if (norm.includes('healthy') || norm.includes('optimal') || norm.includes('active') || norm.includes('low') || norm.includes('established')) {
    colorClass = 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30';
    dotClass = 'bg-emerald-400';
    glowClass = 'shadow-[0_0_8px_rgba(16,185,129,0.3)]';
  } else if (norm.includes('warning') || norm.includes('medium') || norm.includes('time_wait')) {
    colorClass = 'bg-amber-950/50 text-amber-400 border-amber-500/30';
    dotClass = 'bg-amber-400';
    glowClass = 'shadow-[0_0_8px_rgba(245,158,11,0.3)]';
  } else if (norm.includes('critical') || norm.includes('high') || norm.includes('failed') || norm.includes('degraded')) {
    colorClass = 'bg-rose-950/50 text-rose-400 border-rose-500/30';
    dotClass = 'bg-rose-400';
    glowClass = 'shadow-[0_0_8px_rgba(244,63,94,0.3)]';
  } else if (norm.includes('resolved') || norm.includes('closed')) {
    colorClass = 'bg-sky-950/50 text-sky-400 border-sky-500/30';
    dotClass = 'bg-sky-400';
    glowClass = 'shadow-[0_0_8px_rgba(14,165,233,0.3)]';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-md transition-all ${colorClass} ${sizeClasses[size]} ${glowClass}`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotClass}`} />
      </span>
      <span className="tracking-wide capitalize">{status}</span>
    </span>
  );
};
