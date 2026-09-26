import React from 'react';
import {
  Gauge,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  ArrowUpRight,
  HelpCircle,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import type { SnatResponse } from '../types';

interface SnatPageProps {
  snatData: SnatResponse | null;
  onOpenSimulation: () => void;
}

export const SnatPage: React.FC<SnatPageProps> = ({ snatData, onOpenSimulation }) => {
  if (!snatData) return null;

  const riskColor = {
    LOW: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    MEDIUM: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    HIGH: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
    CRITICAL: 'text-rose-500 bg-rose-950/60 border-rose-500/50 animate-pulse',
  }[snatData.risk_level] || 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';

  const riskExplanation = {
    LOW: 'Healthy state: Over 50% port headroom available across both configured public IPs. No SNAT exhaustion risk.',
    MEDIUM: 'Warning state: Approaching 70% capacity during peak outbound hours. Monitor port recycling rate.',
    HIGH: 'Attention required: Port headroom constrained (>75%). Recommend attaching additional Public IP or Prefix to double capacity.',
    CRITICAL: 'Potential SNAT exhaustion: Port depletion detected (>90%). Outbound connections risk packet drops or connection resets!',
  }[snatData.risk_level];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/30">
              CORE METRIC
            </span>
            <span className="text-xs text-slate-400 font-mono">Source Network Address Translation Engine</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>SNAT Port Monitoring</span>
            <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${riskColor}`}>
              Risk Level: {snatData.risk_level}
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real-time port allocation metrics and exhaustion risk detection for Azure NAT Gateway outbound translation.
          </p>
        </div>

        <button
          onClick={onOpenSimulation}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer"
        >
          <Zap className="h-4 w-4 fill-white" />
          <span>Simulate SNAT Load</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total SNAT Ports"
          value={snatData.total_snat_ports.toLocaleString()}
          subtitle={`${snatData.public_ip_count} Public IPs × 64,512 Ports`}
          icon={Gauge}
          statusColor="azure"
        />

        <KpiCard
          title="Used Ports"
          value={snatData.used_ports.toLocaleString()}
          subtitle="Currently active port mappings"
          icon={Zap}
          statusColor={snatData.utilization_percentage > 75 ? 'amber' : 'emerald'}
          progress={{ current: snatData.used_ports, max: snatData.total_snat_ports }}
        />

        <KpiCard
          title="Available Headroom"
          value={snatData.available_ports.toLocaleString()}
          subtitle="Unallocated ephemeral ports"
          icon={ShieldCheck}
          statusColor="emerald"
        />

        <KpiCard
          title="Port Allocation Rate"
          value={`${snatData.port_allocation_rate_per_sec} /s`}
          subtitle="New translations created per second"
          icon={TrendingUp}
          statusColor="cyan"
        />
      </div>

      {/* Hero Visual: Large Utilization Gauge & Risk Tier Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Capacity Utilization Level
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
                {snatData.utilization_percentage.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">
                ({snatData.used_ports.toLocaleString()} of {snatData.total_snat_ports.toLocaleString()} ports utilized)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-right">
            <div className="text-[11px] text-slate-400">Failed Port Allocations</div>
            <div className="text-lg font-mono font-bold text-white">
              {snatData.failed_allocations_count === 0 ? (
                <span className="text-emerald-400">0 Drops</span>
              ) : (
                <span className="text-rose-400">{snatData.failed_allocations_count} Exhaustion Drops</span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Multi-segment Visual Meter */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-slate-950 p-0.5 border border-slate-800 flex overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                snatData.utilization_percentage >= 90
                  ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : snatData.utilization_percentage >= 75
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                  : 'bg-gradient-to-r from-blue-600 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(2, snatData.utilization_percentage))}%` }}
            />
          </div>

          {/* Threshold markers */}
          <div className="grid grid-cols-4 text-[10px] font-mono text-slate-500 text-center pt-1">
            <div className="text-left text-emerald-400">0% (Healthy)</div>
            <div>50% (Medium Alert)</div>
            <div>75% (High Risk)</div>
            <div className="text-right text-rose-400">90%+ (Critical Exhaustion)</div>
          </div>
        </div>

        {/* Risk Level Explainer Box */}
        <div className={`rounded-xl border p-4 backdrop-blur-md ${riskColor}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Exhaustion Risk Diagnosis: {snatData.risk_level}
              </h4>
              <p className="mt-1 text-xs opacity-90 leading-relaxed">{riskExplanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SNAT Utilization Over Time Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
        <div className="pb-3 border-b border-slate-800/80">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>24-Hour SNAT Port Utilization Timeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Continuous tracking of allocated vs available ports</p>
        </div>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={snatData.history}>
              <defs>
                <linearGradient id="snatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="utilization_pct"
                name="Utilization %"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fill="url(#snatGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technical Architecture Comparison: Why Azure NAT Gateway prevents SNAT exhaustion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Default Outbound Access</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">Pre-allocated & Fragile</div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            VMs get static 1,024 pre-allocated ports. Even if a VM needs only 10 ports, all 1,024 are locked. A sudden burst exhausts ports immediately, resulting in dropped connections.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Gauge className="h-4 w-4" />
            <span>Load Balancer Outbound</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">Static Port Slicing</div>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Ports are divided equally among backend pool VMs. Adding more VMs reduces available ports per instance, creating hidden exhaustion bottlenecks.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Azure NAT Gateway (Recommended)</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">Dynamic On-Demand 4-Tuple</div>
          <p className="mt-2 text-xs text-emerald-200/80 leading-relaxed">
            Ports are pooled globally (64,512 per IP). Every outbound session dynamically takes a port from the pool and immediately releases it upon close. Zero pre-allocation waste!
          </p>
        </div>
      </div>
    </div>
  );
};
