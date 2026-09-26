import React from 'react';
import { X, Network, Server, Globe, Cpu, Layers, ShieldCheck, ArrowUpRight } from 'lucide-react';
import type { TopologyNode } from '../../types';

interface NodeDetailModalProps {
  node: TopologyNode | null;
  onClose: () => void;
  onNavigateToPage?: (page: any) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onNavigateToPage,
}) => {
  if (!node) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'internet':
        return <Globe className="h-6 w-6 text-cyan-400" />;
      case 'public_ip':
        return <ArrowUpRight className="h-6 w-6 text-blue-400" />;
      case 'nat_gateway':
        return <Cpu className="h-6 w-6 text-indigo-400" />;
      case 'vnet':
        return <Network className="h-6 w-6 text-blue-400" />;
      case 'subnet':
        return <Layers className="h-6 w-6 text-teal-400" />;
      default:
        return <Server className="h-6 w-6 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              {getIcon(node.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-blue-400">{node.type.replace('_', ' ')}</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.2">
                  {node.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">{node.label}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Node Properties */}
        <div className="mt-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Node Configuration & Telemetry
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
            {Object.entries(node.details).map(([key, val]) => (
              <div key={key} className="flex items-start justify-between text-xs gap-3">
                <span className="text-slate-400 capitalize font-medium">{key.replace('_', ' ')}:</span>
                <span className="font-mono text-slate-200 text-right">
                  {Array.isArray(val) ? val.join(', ') : typeof val === 'boolean' ? (val ? 'Enabled' : 'Disabled') : String(val)}
                </span>
              </div>
            ))}
          </div>

          {/* Educational Callout */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-200/90 leading-relaxed">
              {node.type === 'nat_gateway' && (
                'NAT Gateway dynamically allocates SNAT ports on demand. It provides predictable outbound IP to all instances in attached subnets without requiring public IPs on individual virtual machines.'
              )}
              {node.type === 'subnet' && (
                'All instances in this subnet automatically route default 0.0.0.0/0 traffic through the NAT Gateway. Inbound connections to private IPs remain completely blocked from internet.'
              )}
              {node.type === 'public_ip' && (
                'Provides 64,512 SNAT ports per IP address. External API firewalls (e.g. Stripe, Banking APIs) whitelist this deterministic IP.'
              )}
              {node.type === 'internet' && (
                'External SaaS, cloud APIs, and web endpoints receive packets originating strictly from the verified Azure Public IP addresses.'
              )}
              {node.type === 'vnet' && (
                'Azure Virtual Network isolating customer workloads while enabling unified egress control.'
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
