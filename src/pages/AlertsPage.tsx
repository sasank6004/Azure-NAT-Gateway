import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  RefreshCw,
  ShieldAlert,
  Clock,
  Check,
  Search,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import type { AlertItem } from '../types';

interface AlertsPageProps {
  alerts: AlertItem[];
  onResolveAlert: (alertId: string) => Promise<void>;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onResolveAlert,
  onRefresh,
  isRefreshing = false,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const filtered = alerts.filter((a) => {
    const matchesSev =
      selectedSeverity === 'all' || a.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchesStat =
      selectedStatus === 'all' || a.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.alert_type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSev && matchesStat && matchesSearch;
  });

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      await onResolveAlert(id);
    } finally {
      setResolvingId(null);
    }
  };

  const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const criticalCount = alerts.filter((a) => a.status === 'ACTIVE' && (a.severity === 'CRITICAL' || a.severity === 'HIGH')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-rose-400 border border-rose-500/30">
              AZURE MONITOR ALERTS
            </span>
            <span className="text-xs text-slate-400 font-mono">Incident Management</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Alert Center</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
              {activeCount} Active Incidents
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real-time alerting for SNAT port constraints, unexpected traffic bursts, and connectivity anomalies.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span>Refresh Alerts</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Alerts</div>
          <div className="mt-2 text-2xl font-bold text-white">{alerts.length}</div>
          <div className="mt-1 text-xs text-slate-400">Past 30-day recorded telemetry</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Unresolved</div>
          <div className="mt-2 text-2xl font-bold text-amber-400">{activeCount}</div>
          <div className="mt-1 text-xs text-slate-400">Requires engineer acknowledgment</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">High / Critical</div>
          <div className="mt-2 text-2xl font-bold text-rose-400">{criticalCount}</div>
          <div className="mt-1 text-xs text-rose-300/80">Immediate attention needed</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by title, component, or description..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/60 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/60 cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-500">
            No alerts matching filter criteria.
          </div>
        ) : (
          filtered.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 backdrop-blur-xl transition-all ${
                alert.status === 'ACTIVE'
                  ? alert.severity === 'CRITICAL' || alert.severity === 'HIGH'
                    ? 'border-rose-500/40 bg-rose-950/20'
                    : alert.severity === 'WARNING'
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : 'border-slate-800 bg-slate-900/60'
                  : 'border-slate-800/60 bg-slate-950/40 opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <StatusBadge status={alert.severity} size="sm" showPulse={alert.status === 'ACTIVE'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-wide">{alert.title}</span>
                      <span className="text-[10px] font-mono rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
                        {alert.id}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {alert.description}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
                      <span>Component: {alert.component}</span>
                      <span>•</span>
                      <span>Category: {alert.alert_type}</span>
                      <span>•</span>
                      <span>Occurred: {alert.timestamp}</span>
                      {alert.resolved_at && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400">Resolved at: {alert.resolved_at}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {alert.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    disabled={resolvingId === alert.id}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
                  >
                    <Check className="h-4 w-4" />
                    <span>{resolvingId === alert.id ? 'Resolving...' : 'Mark Resolved'}</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 self-start md:self-auto bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-3 py-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Resolved</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
