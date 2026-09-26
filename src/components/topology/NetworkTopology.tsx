import React, { useState } from 'react';
import {
  Globe,
  ArrowUpRight,
  Cpu,
  Network,
  Layers,
  Server,
  Database,
  Box,
  CheckCircle2,
  Zap,
  Info,
} from 'lucide-react';
import type { TopologyNode } from '../../types';

interface NetworkTopologyProps {
  onSelectNode: (node: TopologyNode) => void;
  publicIps: string[];
  activeConnections: number;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  onSelectNode,
  publicIps,
  activeConnections,
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const subnetsData: TopologyNode[] = [
    {
      id: 'node-snet-frontend',
      label: 'frontend-subnet',
      type: 'subnet',
      status: 'Healthy',
      details: {
        cidr: '10.0.1.0/24',
        resources: '24 Pods / Instances',
        outbound_ip: publicIps[0] || '20.45.123.10',
        active_connections: 428,
        snat_utilization: '36.4%',
      },
    },
    {
      id: 'node-snet-backend',
      label: 'backend-subnet',
      type: 'subnet',
      status: 'Healthy',
      details: {
        cidr: '10.0.2.0/24',
        resources: '18 Microservices',
        outbound_ip: publicIps[0] || '20.45.123.10',
        active_connections: 512,
        snat_utilization: '41.2%',
      },
    },
    {
      id: 'node-snet-database',
      label: 'database-subnet',
      type: 'subnet',
      status: 'Healthy',
      details: {
        cidr: '10.0.3.0/24',
        resources: '8 Managed DBs',
        outbound_ip: publicIps[0] || '20.45.123.10',
        active_connections: 308,
        snat_utilization: '24.8%',
      },
    },
    {
      id: 'node-snet-aks',
      label: 'aks-nodes-subnet',
      type: 'subnet',
      status: 'Healthy',
      details: {
        cidr: '10.0.4.0/24',
        resources: '32 AKS Worker Nodes',
        outbound_ip: publicIps[1] || '20.45.123.11',
        active_connections: 620,
        snat_utilization: '48.9%',
      },
    },
  ];

  const gatewayNode: TopologyNode = {
    id: 'node-nat-gw',
    label: 'Azure NAT Gateway (nat-gw-prod-eastus)',
    type: 'nat_gateway',
    status: 'Healthy',
    details: {
      sku: 'Standard',
      zones: ['1', '2', '3'],
      public_ips: publicIps,
      total_snat_ports: 129024,
      idle_timeout: '4 minutes',
      tcp_reset: 'Enabled',
      throughput: '50 Gbps per gateway fabric',
    },
  };

  const internetNode: TopologyNode = {
    id: 'node-internet',
    label: 'Public Internet & SaaS Endpoints',
    type: 'internet',
    status: 'Healthy',
    details: {
      destinations: 'Stripe, Entra ID, GitHub, Docker Hub',
      security: 'Whitelisting verified IP 20.45.123.10',
    },
  };

  const publicIpNode: TopologyNode = {
    id: 'node-pip',
    label: `Public IP Pool (${publicIps.join(', ')})`,
    type: 'public_ip',
    status: 'Healthy',
    details: {
      ips: publicIps,
      ports_per_ip: '64,512 SNAT Ports',
      total_ports: '129,024 Total Available',
      sku: 'Standard Static IPv4',
    },
  };

  const vnetNode: TopologyNode = {
    id: 'node-vnet',
    label: 'Virtual Network (vnet-prod-eastus: 10.0.0.0/16)',
    type: 'vnet',
    status: 'Healthy',
    details: {
      cidr: '10.0.0.0/16',
      region: 'East US',
      resource_group: 'rg-networking-prod',
      attached_subnets: 4,
    },
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header with info */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Predictable Outbound Architecture Flow</span>
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-blue-400 border border-blue-500/30">
              Interactive Topology
            </span>
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Click any network tier to inspect SNAT mapping, private CIDRs, and deterministic routing paths.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>Active Flow Rate: {activeConnections.toLocaleString()} TCP/UDP</span>
        </div>
      </div>

      {/* Diagram Canvas */}
      <div className="relative z-10 mt-8 flex flex-col items-center gap-6">
        {/* Tier 1: Public Internet */}
        <div
          onClick={() => onSelectNode(internetNode)}
          onMouseEnter={() => setHoveredNode('internet')}
          onMouseLeave={() => setHoveredNode(null)}
          className={`group flex items-center gap-3 rounded-2xl border px-6 py-3.5 backdrop-blur-md transition-all cursor-pointer ${
            hoveredNode === 'internet'
              ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]'
              : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
          }`}
        >
          <div className="rounded-xl bg-cyan-500/15 p-2.5 text-cyan-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">External SaaS & APIs</div>
            <div className="text-xs font-bold text-white">Public Internet (api.stripe.com, GitHub, Entra ID)</div>
          </div>
        </div>

        {/* Connector 1: Internet to Public IP */}
        <div className="flex flex-col items-center justify-center">
          <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          <div className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-mono text-cyan-300 border border-blue-500/30">
            ↑ Whitelisted Ingress / Egress ↓
          </div>
          <div className="h-6 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        </div>

        {/* Tier 2: Public IP Addresses */}
        <div
          onClick={() => onSelectNode(publicIpNode)}
          onMouseEnter={() => setHoveredNode('pip')}
          onMouseLeave={() => setHoveredNode(null)}
          className={`group flex items-center gap-3 rounded-2xl border px-6 py-3.5 backdrop-blur-md transition-all cursor-pointer ${
            hoveredNode === 'pip'
              ? 'border-blue-400 bg-blue-950/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]'
              : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
          }`}
        >
          <div className="rounded-xl bg-blue-500/15 p-2.5 text-blue-400">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-blue-400">Deterministic Outbound IPs</div>
            <div className="text-xs font-bold text-white font-mono">{publicIps.join('  •  ')}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">64,512 SNAT Ports / IP • Static Standard SKU</div>
          </div>
        </div>

        {/* Connector 2: Public IP to NAT Gateway */}
        <div className="flex flex-col items-center justify-center">
          <div className="h-6 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <div className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] font-mono text-purple-300 border border-purple-500/30">
            SNAT Dynamic Allocation (4-Tuple)
          </div>
          <div className="h-6 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
        </div>

        {/* Tier 3: Azure NAT Gateway (The Core) */}
        <div
          onClick={() => onSelectNode(gatewayNode)}
          onMouseEnter={() => setHoveredNode('nat-gw')}
          onMouseLeave={() => setHoveredNode(null)}
          className={`group relative flex items-center gap-4 rounded-2xl border-2 px-8 py-5 backdrop-blur-md transition-all cursor-pointer ${
            hoveredNode === 'nat-gw'
              ? 'border-blue-400 bg-blue-950/60 shadow-[0_0_35px_rgba(22,143,255,0.4)] scale-105'
              : 'border-blue-500/40 bg-slate-900/90 hover:border-blue-400 shadow-[0_0_20px_rgba(22,143,255,0.2)]'
          }`}
        >
          <div className="rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-3 text-white shadow-lg">
            <Cpu className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-400">Azure Resource</span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-0.2">
                Zone Redundant (1, 2, 3)
              </span>
            </div>
            <div className="text-sm font-extrabold text-white tracking-wide">nat-gw-prod-eastus</div>
            <div className="mt-1 flex items-center gap-4 text-[11px] text-slate-300 font-mono">
              <span>Standard SKU</span>
              <span>•</span>
              <span>129,024 Ports</span>
              <span>•</span>
              <span>50 Gbps Capacity</span>
            </div>
          </div>
        </div>

        {/* Connector 3: NAT Gateway to Virtual Network */}
        <div className="flex flex-col items-center justify-center">
          <div className="h-6 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500 shadow-[0_0_8px_rgba(22,143,255,0.6)]" />
          <div className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-mono text-blue-300 border border-blue-500/30">
            Subnet Association Route: 0.0.0.0/0
          </div>
          <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-500 to-teal-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
        </div>

        {/* Tier 4: Virtual Network Boundary */}
        <div
          onClick={() => onSelectNode(vnetNode)}
          onMouseEnter={() => setHoveredNode('vnet')}
          onMouseLeave={() => setHoveredNode(null)}
          className={`w-full max-w-4xl rounded-2xl border p-5 backdrop-blur-md transition-all cursor-pointer ${
            hoveredNode === 'vnet'
              ? 'border-blue-400 bg-blue-950/30 shadow-[0_0_25px_rgba(22,143,255,0.25)]'
              : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold text-white">vnet-prod-eastus</span>
              <span className="text-[11px] font-mono text-cyan-400">(10.0.0.0/16)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">4 Subnets Attached to NAT Gateway</span>
          </div>

          {/* Subnets Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            {subnetsData.map((snet) => (
              <div
                key={snet.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(snet);
                }}
                className="group rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-teal-400" />
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {snet.label}
                    </span>
                  </div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>

                <div className="mt-2 text-[11px] font-mono text-cyan-400">{snet.details.cidr}</div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>{snet.details.resources}</span>
                  <span className="font-mono text-slate-300">{snet.details.active_connections} flows</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 5: Workload Resources Details */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Virtual Machines</div>
              <div className="text-[10px] text-slate-400">No public IPs required on NICs; full private isolation.</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Box className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">AKS Containers & Pods</div>
              <div className="text-[10px] text-slate-400">Zero SNAT port exhaustion during container image pulls.</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Cloud Databases</div>
              <div className="text-[10px] text-slate-400">Secure outbound replication without opening inbound ports.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
