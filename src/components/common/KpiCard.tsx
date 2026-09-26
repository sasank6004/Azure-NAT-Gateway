import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  progress?: {
    current: number;
    max: number;
    color?: string;
  };
  statusColor?: 'azure' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'violet';
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  progress,
  statusColor = 'azure',
  onClick,
}) => {
  const colorMap = {
    azure: {
      bg: 'from-blue-600/10 to-transparent',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/15 text-blue-400',
      progress: 'bg-blue-500',
    },
    emerald: {
      bg: 'from-emerald-600/10 to-transparent',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      progress: 'bg-emerald-500',
    },
    cyan: {
      bg: 'from-cyan-600/10 to-transparent',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
      progress: 'bg-cyan-500',
    },
    amber: {
      bg: 'from-amber-600/10 to-transparent',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/15 text-amber-400',
      progress: 'bg-amber-500',
    },
    rose: {
      bg: 'from-rose-600/10 to-transparent',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/15 text-rose-400',
      progress: 'bg-rose-500',
    },
    violet: {
      bg: 'from-purple-600/10 to-transparent',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/15 text-purple-400',
      progress: 'bg-purple-500',
    },
  };

  const scheme = colorMap[statusColor] || colorMap.azure;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-200 ${
        scheme.border
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg' : ''}`}
    >
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${scheme.bg} blur-2xl`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</span>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</div>
        </div>
        <div className={`rounded-lg p-2.5 ${scheme.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {progress && (
        <div className="mt-4 relative z-10">
          <div className="h-1.5 w-full rounded-full bg-slate-800">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${scheme.progress}`}
              style={{
                width: `${Math.min(100, Math.max(0, (progress.current / progress.max) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 relative z-10">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center font-semibold ${
                trend.isPositive ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {trend.value}
              {trend.label && <span className="ml-1 text-[11px] font-normal text-slate-400">{trend.label}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
