import React, { useState, useEffect } from 'react';
import { Search, X, Layers, ArrowRight, BookOpen, Gauge, DollarSign, Network, Cpu } from 'lucide-react';
import type { PageId } from '../layout/Sidebar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchableItems = [
    { title: 'SNAT Port Monitoring', category: 'Feature', page: 'snat' as PageId, icon: Gauge, desc: '64,512 ports per IP, exhaustion prevention' },
    { title: 'Network Topology Diagram', category: 'Architecture', page: 'architecture' as PageId, icon: Network, desc: 'Internet -> Public IP -> NAT Gateway -> Subnets' },
    { title: 'frontend-subnet (10.0.1.0/24)', category: 'Subnet', page: 'subnets' as PageId, icon: Layers, desc: '24 resources, outbound IP 20.45.123.10' },
    { title: 'backend-subnet (10.0.2.0/24)', category: 'Subnet', page: 'subnets' as PageId, icon: Layers, desc: '18 resources, payment API egress' },
    { title: 'database-subnet (10.0.3.0/24)', category: 'Subnet', page: 'subnets' as PageId, icon: Layers, desc: '8 resources, Azure Blob export' },
    { title: 'aks-nodes-subnet (10.0.4.0/24)', category: 'Subnet', page: 'subnets' as PageId, icon: Layers, desc: '32 resources, outbound IP 20.45.123.11' },
    { title: 'Public IP: 20.45.123.10', category: 'Public IP', page: 'nat-gateway' as PageId, icon: Cpu, desc: 'Static Standard IPv4 Egress' },
    { title: 'Public IP: 20.45.123.11', category: 'Public IP', page: 'nat-gateway' as PageId, icon: Cpu, desc: 'Static Standard IPv4 Egress (Secondary)' },
    { title: 'Cost Analysis & Forecasting', category: 'Billing', page: 'cost' as PageId, icon: DollarSign, desc: '$0.045/hour + $0.045/GB data processing' },
    { title: 'Why is Predictable Outbound IP Important?', category: 'Documentation', page: 'documentation' as PageId, icon: BookOpen, desc: 'Partner firewalls, whitelisting, SNAT mechanics' },
  ];

  const filtered = searchableItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, subnet, IP address, or documentation topic..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching resources or topics found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  className="flex items-center justify-between rounded-xl p-3 hover:bg-slate-800/70 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-lg bg-slate-800 p-2 text-blue-400 group-hover:bg-blue-600/20 group-hover:text-blue-300 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] uppercase font-mono text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
