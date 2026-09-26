import React, { useState } from 'react';
import {
  Layers,
  Search,
  CheckCircle2,
  ExternalLink,
  Shield,
  Server,
  ArrowRight,
  Info,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import type { SubnetItem } from '../types';

interface SubnetsPageProps {
  subnets: SubnetItem[];
  onSelectSubnet?: (subnet: SubnetItem) => void;
}

export const SubnetsPage: React.FC<SubnetsPageProps> = ({ subnets, onSelectSubnet }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = subnets.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cidr.includes(searchTerm) ||
      s.outbound_ip.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || s.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/30">
            VIRTUAL NETWORK TOPOLOGY
          </span>
          <span className="text-xs text-slate-400 font-mono">vnet-prod-eastus (10.0.0.0/16)</span>
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Attached Subnets
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
          Subnets associated with Azure NAT Gateway. Outbound traffic is automatically routed via the dedicated NAT Gateway public IP addresses without per-instance public IPs.
        </p>
      </div>

      {/* Subnet rules educational card */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-blue-500/20 p-2.5 text-blue-400 mt-0.5">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Azure NAT Gateway Subnet Association Rule
            </h4>
            <p className="mt-1 text-xs text-blue-200/90 leading-relaxed max-w-2xl">
              Multiple subnets within the same virtual network can share a single NAT Gateway. However, an individual subnet can only be attached to <strong>one</strong> NAT Gateway. Attaching NAT Gateway replaces default internet outbound for all resources in that subnet.
            </p>
          </div>
        </div>
      </div>

      {/* Controls: Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter subnets by name, CIDR, or Outbound IP..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500/60 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
          </select>
        </div>
      </div>

      {/* Subnets Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Subnet Name</th>
                <th className="py-3.5 px-4 font-semibold">CIDR</th>
                <th className="py-3.5 px-4 font-semibold">Resources</th>
                <th className="py-3.5 px-4 font-semibold">Private IP Range</th>
                <th className="py-3.5 px-4 font-semibold">Outbound IP</th>
                <th className="py-3.5 px-4 font-semibold">Connections</th>
                <th className="py-3.5 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                    No subnets found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectSubnet && onSelectSubnet(s)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-blue-300 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{s.cidr}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="font-semibold text-white">{s.resources_count}</span> resources
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{s.private_ip_range}</td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-md bg-blue-500/10 px-2 py-1 font-mono font-semibold text-blue-400 border border-blue-500/20">
                        {s.outbound_ip}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-200 font-semibold">{s.active_connections}</span>{' '}
                      <span className="text-slate-500">active</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={s.status} size="sm" />
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
