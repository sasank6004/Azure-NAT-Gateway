import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Filter,
  Search,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';
import type { ConnectionListResponse } from '../types';

interface ConnectionsPageProps {
  connectionsData: ConnectionListResponse | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = ({
  connectionsData,
  onRefresh,
  isRefreshing = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProtocol, setSelectedProtocol] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!connectionsData) return null;

  const filteredItems = connectionsData.items.filter((item) => {
    const matchesStatus =
      selectedStatus === 'all' || item.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesProtocol =
      selectedProtocol === 'all' || item.protocol.toLowerCase() === selectedProtocol.toLowerCase();
    const matchesSearch =
      item.source_ip.includes(searchTerm) ||
      item.destination_host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destination_ip.includes(searchTerm) ||
      item.source_subnet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.snat_port.toString().includes(searchTerm);

    return matchesStatus && matchesProtocol && matchesSearch;
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/30">
              NETWORK TELEMETRY
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Egress Sessions</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Connection Monitoring
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Live TCP/UDP outbound sessions translated via Azure NAT Gateway with assigned SNAT port mappings and session durations.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span>Refresh Sessions</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Connections"
          value={connectionsData.total_connections.toLocaleString()}
          icon={ArrowLeftRight}
          statusColor="azure"
        />
        <KpiCard
          title="Active Connections"
          value={connectionsData.active_connections.toLocaleString()}
          icon={Activity}
          statusColor="emerald"
        />
        <KpiCard
          title="Failed Connections"
          value={connectionsData.failed_connections.toLocaleString()}
          icon={AlertCircle}
          statusColor={connectionsData.failed_connections > 5 ? 'rose' : 'emerald'}
        />
        <KpiCard
          title="Connections / Min"
          value={`${connectionsData.connections_per_minute}`}
          icon={Clock}
          statusColor="cyan"
        />
        <KpiCard
          title="Avg Session Duration"
          value={`${connectionsData.avg_connection_duration_sec}s`}
          icon={HardDrive}
          statusColor="violet"
        />
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by private IP, host (e.g. stripe.com), subnet, or SNAT port..."
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
              <option value="established">Established</option>
              <option value="closed">Closed</option>
              <option value="time_wait">Time_Wait</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Protocol Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Protocol:</span>
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/60 cursor-pointer"
            >
              <option value="all">All Protocols</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Connection Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Source (Private IP & Subnet)</th>
                <th className="py-3.5 px-4 font-semibold">Destination (Host & IP)</th>
                <th className="py-3.5 px-4 font-semibold">Proto</th>
                <th className="py-3.5 px-4 font-semibold">Dst Port</th>
                <th className="py-3.5 px-4 font-semibold">SNAT Port</th>
                <th className="py-3.5 px-4 font-semibold">Volume</th>
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-500 font-sans">
                    No connection flows matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{item.source_ip}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{item.source_subnet}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-cyan-400 font-sans">{item.destination_host}</div>
                      <div className="text-[10px] text-slate-500">{item.destination_ip}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                        {item.protocol}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">:{item.destination_port}</td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[11px] font-bold text-blue-400 border border-blue-500/20">
                        {item.snat_port}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans">{formatBytes(item.bytes_transferred)}</td>
                    <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">{item.timestamp}</td>
                    <td className="py-3 px-4 text-right font-sans">
                      <StatusBadge status={item.status} size="sm" showPulse={item.status === 'Established'} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
