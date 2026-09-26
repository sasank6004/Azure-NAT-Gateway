import React from 'react';
import {
  Cpu,
  RefreshCw,
  Globe,
  Layers,
  Activity,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  Calendar,
  Settings,
  HardDrive,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import type { NatGatewayDetails } from '../types';

interface NatGatewayPageProps {
  gateway: NatGatewayDetails | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const NatGatewayPage: React.FC<NatGatewayPageProps> = ({
  gateway,
  onRefresh,
  isRefreshing = false,
}) => {
  if (!gateway) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/30">
              MICROSOFT.NETWORK/NATGATEWAYS
            </span>
            <span className="text-xs text-slate-400 font-mono">Resource ID: /subscriptions/{gateway.subscription_id}</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>{gateway.name}</span>
            <StatusBadge status={gateway.status} size="lg" />
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Standard SKU NAT Gateway providing dedicated outbound egress for 4 subnets in East US.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Gateway'}</span>
          </button>
        </div>
      </div>

      {/* Main Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Region & Zones</div>
          <div className="mt-2 text-lg font-bold text-white">{gateway.region}</div>
          <div className="mt-1 text-xs text-cyan-400 font-mono">
            Availability Zones: {gateway.zones.join(', ')}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Throughput Capacity</div>
          <div className="mt-2 text-lg font-bold text-white">{gateway.current_throughput_mbps} Mbps</div>
          <div className="mt-1 text-xs text-emerald-400">Up to 50 Gbps scale per resource</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Idle Timeout & TCP Reset</div>
          <div className="mt-2 text-lg font-bold text-white">{gateway.idle_timeout_minutes} Minutes</div>
          <div className="mt-1 text-xs text-blue-400 font-mono">
            TCP Reset: {gateway.tcp_reset_enabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Created Date</div>
          <div className="mt-2 text-lg font-bold text-white font-mono">
            {new Date(gateway.created_date).toLocaleDateString()}
          </div>
          <div className="mt-1 text-xs text-slate-400">Deployed via ARM/Bicep</div>
        </div>
      </div>

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Public IP Associations */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Associated Public IP Addresses</h3>
            </div>
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-blue-300">
              {gateway.public_ips.length} IPs Attached
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            All outbound connections from attached subnets will deterministically exit through one of the configured static public IP addresses.
          </p>

          <div className="space-y-3">
            {gateway.public_ips.map((ip, idx) => (
              <div
                key={ip}
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-600/20 p-2 text-blue-400 font-mono text-xs font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-white">{ip}</div>
                    <div className="text-[11px] text-slate-400">Standard Static IPv4 • Zone 1,2,3</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-cyan-400">64,512 SNAT Ports</span>
                  <div className="text-[10px] text-slate-500">Dedicated pool</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3.5 text-xs text-blue-200/90 leading-relaxed">
            <strong>Predictable Outbound Guarantee:</strong> External firewall administrators and partner APIs can safely whitelist these exact IP addresses without worrying about dynamic IP rotation or sudden connectivity failures.
          </div>
        </div>

        {/* Right Column: Subnet Attachments */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-400" />
              <h3 className="text-sm font-bold text-white">Associated Virtual Network Subnets</h3>
            </div>
            <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-teal-300">
              {gateway.attached_subnets.length} Subnets
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            NAT Gateway provides subnet-level egress. A subnet can only be associated with one NAT Gateway at a time.
          </p>

          <div className="space-y-3">
            {gateway.attached_subnets.map((snetName) => (
              <div
                key={snetName}
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-teal-600/20 p-2 text-teal-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{snetName}</div>
                    <div className="text-[11px] text-slate-400">vnet-prod-eastus • Egress Next Hop: NAT Gateway</div>
                  </div>
                </div>
                <StatusBadge status="Healthy" size="sm" />
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center justify-between text-xs text-slate-400">
            <span>Cumulative Data Processed:</span>
            <span className="font-mono font-bold text-white">{gateway.data_processed_gb.toFixed(1)} GB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
