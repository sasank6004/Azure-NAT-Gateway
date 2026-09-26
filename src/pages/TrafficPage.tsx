import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  TrendingUp,
  Globe,
  HardDrive,
  BarChart3,
  Clock,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import type { TrafficResponse } from '../types';

interface TrafficPageProps {
  trafficData: TrafficResponse | null;
  onTimeframeChange: (tf: string) => void;
}

export const TrafficPage: React.FC<TrafficPageProps> = ({ trafficData, onTimeframeChange }) => {
  const [activeTimeframe, setActiveTimeframe] = useState<string>('24h');

  if (!trafficData) return null;

  const timeframes = [
    { label: 'Last 1 Hour', value: '1h' },
    { label: 'Last 6 Hours', value: '6h' },
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
  ];

  const handleTfClick = (tf: string) => {
    setActiveTimeframe(tf);
    onTimeframeChange(tf);
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
            <span className="text-xs text-slate-400 font-mono">Metrics / Azure Monitor</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Traffic Monitoring
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Historical outbound throughput, request frequencies, and destination endpoints routed through Azure NAT Gateway.
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => handleTfClick(tf.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeTimeframe === tf.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Total Data Processed"
          value={`${trafficData.total_data_processed_gb.toFixed(1)} GB`}
          subtitle="Cumulative Transferred Volume"
          icon={HardDrive}
          statusColor="azure"
        />
        <KpiCard
          title="Peak Throughput"
          value={`${trafficData.peak_throughput_mbps} Mbps`}
          subtitle="Sustained Bandwidth Peak"
          icon={TrendingUp}
          statusColor="cyan"
        />
        <KpiCard
          title="Active Monitoring Window"
          value={activeTimeframe.toUpperCase()}
          subtitle="Granularity: 5-minute sampling"
          icon={Clock}
          statusColor="emerald"
        />
      </div>

      {/* Chart 1: Outbound Traffic Over Time */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>Outbound Throughput Over Time (Mbps)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Continuous bandwidth transferred across NAT Gateway fabric</p>
          </div>
        </div>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData.metrics}>
              <defs>
                <linearGradient id="areaTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" Mbps" />
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
                dataKey="traffic_mbps"
                name="Throughput"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#areaTraffic)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid: RPM & Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Per Minute */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              <span>Requests Per Minute (RPM)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Outbound HTTP/HTTPS and TCP handshakes</p>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData.metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="requests_per_min" name="Requests / Min" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Concurrent Connections */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>Concurrent Connections</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Active translation sessions held in NAT table</p>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData.metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="connections"
                  name="Active Connections"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Destination Endpoints Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Top Destination SaaS & Web Endpoints</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">By Transferred Request Count</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-semibold">Destination Host</th>
                <th className="py-3 px-3 font-semibold">IP Address</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Request Volume</th>
                <th className="py-3 px-3 font-semibold text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trafficData.top_destinations.map((dest) => (
                <tr key={dest.host} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-white">{dest.host}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{dest.ip}</td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {dest.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">
                    {dest.requests.toLocaleString()} reqs
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${dest.percentage}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-300 text-[11px]">{dest.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
