import React from 'react';
import {
  Network,
  Cpu,
  Layers,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  ExternalLink,
} from 'lucide-react';
import { NetworkTopology } from '../components/topology/NetworkTopology';
import type { TopologyNode } from '../types';

interface ArchitecturePageProps {
  publicIps: string[];
  activeConnections: number;
  onSelectNode: (node: TopologyNode) => void;
}

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({
  publicIps,
  activeConnections,
  onSelectNode,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Outbound Initiation',
      desc: 'Workloads inside private subnets (VMs, AKS pods, app containers) make an outbound request to an external address (e.g. https://api.stripe.com:443).',
    },
    {
      num: '02',
      title: 'Subnet Next-Hop Egress',
      desc: 'Azure SDN fabric recognizes the attached NAT Gateway on the subnet. Traffic is automatically routed into the NAT Gateway engine without requiring user-defined route (UDR) tables.',
    },
    {
      num: '03',
      title: 'Dynamic 4-Tuple SNAT Allocation',
      desc: 'NAT Gateway selects an available SNAT port from its 129,024 port pool across static IPs (20.45.123.10 / 20.45.123.11) using a unique 4-tuple translation key.',
    },
    {
      num: '04',
      title: 'Predictable Public Egress',
      desc: 'The packet leaves Microsoft backbone into the public internet with the stable Azure Public IP address as the Source IP.',
    },
    {
      num: '05',
      title: 'Inbound Return Response',
      desc: 'The external API replies back to the deterministic public IP and assigned SNAT port. NAT Gateway translates the response directly to the internal workload private IP.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/30">
            NETWORK TOPOLOGY
          </span>
          <span className="text-xs text-slate-400 font-mono">vnet-prod-eastus • Hub & Spoke Egress</span>
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Network Architecture & Topology
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
          Interactive visualization of deterministic outbound routing, zone redundancy, and SNAT port distribution across attached subnets.
        </p>
      </div>

      {/* Interactive Topology Diagram */}
      <NetworkTopology
        onSelectNode={onSelectNode}
        publicIps={publicIps}
        activeConnections={activeConnections}
      />

      {/* Step by Step Flow Walkthrough */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80">
          <Workflow className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">
            End-to-End Predictable Outbound Connectivity Workflow
          </h3>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-xl font-extrabold font-mono text-cyan-400/80">{st.num}</span>
                <h4 className="mt-2 text-xs font-bold text-white">{st.title}</h4>
                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architectural Best Practices Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Zone Redundancy</span>
          </h4>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Standard SKU NAT Gateway automatically distributes state across Azure Availability Zones 1, 2, and 3. Zone failures do not disrupt existing outbound SNAT sessions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            <span>Coexistence with Load Balancers</span>
          </h4>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Inbound traffic arrives through Azure Standard Load Balancer or Application Gateway. Outbound traffic always exits via NAT Gateway, creating clean symmetric separation.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
            <span>Scalable Public IP Prefixes</span>
          </h4>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Attach up to 16 public IP addresses or contiguous IP prefixes to scale from 64,512 ports up to over 1,000,000 SNAT ports per NAT Gateway without architectural downtime.
          </p>
        </div>
      </div>
    </div>
  );
};
