import React from 'react';
import {
  Activity,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Server,
  Play,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import type { DashboardData, TrafficResponse, SnatResponse, AlertItem } from '../types';
import type { PageId } from '../components/layout/Sidebar';

interface DashboardPageProps {
  data: DashboardData | null;
  traffic: TrafficResponse | null;
  snat: SnatResponse | null;
  alerts: AlertItem[];
  onNavigate: (page: PageId) => void;
  onOpenSimulation: () => void;
  onSelectNode: (node: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  data,
  traffic,
  snat,
  alerts,
  onNavigate,
  onOpenSimulation,
}) => {
  if (!data) return null;

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/30">
              RESOURCE OVERVIEW
            </span>
            <span className="text-xs text-slate-400 font-mono">rg-networking-prod • East US</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Azure NAT Gateway
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl leading-relaxed">
            "Secure, scalable and predictable outbound connectivity for Azure workloads."
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition-all cursor-pointer"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Run Network Simulation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Network Health */}
        <KpiCard
          title="Network Health"
          value={`${data.network_health} / 100`}
          subtitle="Algorithmic Health Index"
          icon={ShieldCheck}
          statusColor={data.network_health >= 90 ? 'emerald' : data.network_health >= 75 ? 'amber' : 'rose'}
          progress={{ current: data.network_health, max: 100 }}
          onClick={() => onNavigate('documentation')}
        />

        {/* NAT Gateway Status */}
        <KpiCard
          title="NAT Gateway Status"
          value={data.gateway_status}
          subtitle="Standard SKU • Zone Redundant"
          icon={Cpu}
          statusColor={data.gateway_status.toLowerCase() === 'healthy' ? 'emerald' : 'amber'}
          onClick={() => onNavigate('nat-gateway')}
        />

        {/* Public IP Addresses */}
        <KpiCard
          title="Public IP Addresses"
          value={data.public_ip}
          subtitle={`+1 Secondary: ${data.public_ips[1] || '20.45.123.11'}`}
          icon={Globe}
          statusColor="azure"
          onClick={() => onNavigate('nat-gateway')}
        />

        {/* Active Connections */}
        <KpiCard
          title="Active Connections"
          value={data.active_connections.toLocaleString()}
          subtitle="TCP / UDP Egress Sessions"
          icon={Activity}
          statusColor="cyan"
          trend={{ value: '420/min', label: 'new flows', isPositive: true }}
          onClick={() => onNavigate('connections')}
        />

        {/* SNAT Port Utilization */}
        <KpiCard
          title="SNAT Port Utilization"
          value={`${data.snat_utilization}%`}
          subtitle={
            data.snat_utilization > 80
              ? 'Warning: Port headroom constrained'
              : 'Optimal dynamic port allocation'
          }
          icon={Zap}
          statusColor={data.snat_utilization > 80 ? 'rose' : data.snat_utilization > 65 ? 'amber' : 'emerald'}
          progress={{ current: data.snat_utilization, max: 100 }}
          onClick={() => onNavigate('snat')}
        />

        {/* Data Processed */}
        <KpiCard
          title="Data Processed"
          value={`${data.data_processed_gb.toFixed(1)} GB`}
          subtitle="Current Billing Cycle"
          icon={TrendingUp}
          statusColor="violet"
          onClick={() => onNavigate('traffic')}
        />

        {/* Monthly Cost */}
        <KpiCard
          title="Current Month Cost"
          value={`$${data.monthly_cost.toFixed(2)}`}
          subtitle="Hourly Base + Data Charge"
          icon={DollarSign}
          statusColor="azure"
          onClick={() => onNavigate('cost')}
        />

        {/* Attached Subnets */}
        <KpiCard
          title="Attached Subnets"
          value="4 Subnets"
          subtitle="All Subnets Bound to 0.0.0.0/0"
          icon={Layers}
          statusColor="cyan"
          onClick={() => onNavigate('subnets')}
        />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mini Outbound Traffic Chart & SNAT trend */}
        <div className="lg:col-span-2 space-y-6">
          {/* Outbound Traffic Area Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span>Outbound Traffic Throughput (Mbps)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">24-hour telemetry through Azure NAT Gateway</p>
              </div>
              <button
                onClick={() => onNavigate('traffic')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Full Analytics</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="h-60 mt-4">
              {traffic && traffic.metrics && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={traffic.metrics}>
                    <defs>
                      <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0078d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0078d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#334155' }}
                      unit=" Mbps"
                    />
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
                      stroke="#38bdf8"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#trafficGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Quick Subnets Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Subnet-Level Outbound Connectivity</h3>
              </div>
              <button
                onClick={() => onNavigate('subnets')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>View All Subnets</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 font-semibold">Subnet Name</th>
                    <th className="py-2.5 font-semibold">CIDR</th>
                    <th className="py-2.5 font-semibold">Outbound IP</th>
                    <th className="py-2.5 font-semibold">Connections</th>
                    <th className="py-2.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 font-semibold text-white">frontend-subnet</td>
                    <td className="py-3 font-mono text-cyan-400">10.0.1.0/24</td>
                    <td className="py-3 font-mono text-slate-300">20.45.123.10</td>
                    <td className="py-3 text-slate-300">428 active</td>
                    <td className="py-3 text-right">
                      <StatusBadge status="Healthy" size="sm" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 font-semibold text-white">backend-subnet</td>
                    <td className="py-3 font-mono text-cyan-400">10.0.2.0/24</td>
                    <td className="py-3 font-mono text-slate-300">20.45.123.10</td>
                    <td className="py-3 text-slate-300">512 active</td>
                    <td className="py-3 text-right">
                      <StatusBadge status="Healthy" size="sm" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 font-semibold text-white">database-subnet</td>
                    <td className="py-3 font-mono text-cyan-400">10.0.3.0/24</td>
                    <td className="py-3 font-mono text-slate-300">20.45.123.10</td>
                    <td className="py-3 text-slate-300">308 active</td>
                    <td className="py-3 text-right">
                      <StatusBadge status="Healthy" size="sm" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3 font-semibold text-white">aks-nodes-subnet</td>
                    <td className="py-3 font-mono text-cyan-400">10.0.4.0/24</td>
                    <td className="py-3 font-mono text-slate-300">20.45.123.11</td>
                    <td className="py-3 text-slate-300">620 active</td>
                    <td className="py-3 text-right">
                      <StatusBadge status="Healthy" size="sm" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: SNAT Headroom Gauge & Active Alerts */}
        <div className="space-y-6">
          {/* SNAT Port Gauge Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">SNAT Port Utilization</h3>
              </div>
              <span className="text-xs font-mono font-semibold text-cyan-400">
                {snat?.utilization_percentage.toFixed(1)}%
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Available Ports</span>
                <span className="font-mono font-bold text-white">129,024</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Currently Allocated</span>
                <span className="font-mono text-slate-200">
                  {snat?.used_ports.toLocaleString() || '49,287'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Free Port Headroom</span>
                <span className="font-mono text-emerald-400">
                  {snat?.available_ports.toLocaleString() || '79,737'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-800 mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    data.snat_utilization > 85
                      ? 'bg-rose-500'
                      : data.snat_utilization > 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, data.snat_utilization)}%` }}
                />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 mt-4 text-[11px] text-slate-400 leading-snug">
                Azure NAT Gateway prevents SNAT exhaustion through dynamic port pre-allocation on a 4-tuple basis.
              </div>

              <button
                onClick={() => onNavigate('snat')}
                className="w-full mt-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                Inspect SNAT Exhaustion Risk
              </button>
            </div>
          </div>

          {/* Active Alerts Widget */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Operational Alerts</h3>
              </div>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                {activeAlerts.length} Active
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {activeAlerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <span>All telemetry healthy. No active alerts.</span>
                </div>
              ) : (
                activeAlerts.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    onClick={() => onNavigate('alerts')}
                    className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-3 hover:border-slate-700 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                        {a.title}
                      </span>
                      <StatusBadge status={a.severity} size="sm" showPulse={false} />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{a.description}</p>
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">{a.timestamp}</div>
                  </div>
                ))
              )}

              <button
                onClick={() => onNavigate('alerts')}
                className="w-full mt-2 rounded-xl border border-slate-800 hover:bg-slate-800 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Go to Alert Management Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
