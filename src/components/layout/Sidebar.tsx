import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  ArrowLeftRight,
  Activity,
  Gauge,
  DollarSign,
  AlertCircle,
  Network,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Shield,
  ExternalLink,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'nat-gateway'
  | 'subnets'
  | 'connections'
  | 'traffic'
  | 'snat'
  | 'cost'
  | 'alerts'
  | 'architecture'
  | 'documentation';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  unreadAlertCount: number;
  snatUtilization: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  unreadAlertCount,
  snatUtilization,
  isMobileOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nat-gateway' as PageId, label: 'NAT Gateway', icon: Cpu, badge: 'Standard' },
    { id: 'subnets' as PageId, label: 'Subnets', icon: Layers, count: 4 },
    { id: 'connections' as PageId, label: 'Connections', icon: ArrowLeftRight },
    { id: 'traffic' as PageId, label: 'Traffic Monitoring', icon: Activity },
    {
      id: 'snat' as PageId,
      label: 'SNAT Monitoring',
      icon: Gauge,
      badge: `${snatUtilization.toFixed(0)}%`,
      badgeColor: snatUtilization > 85 ? 'rose' : snatUtilization > 70 ? 'amber' : 'emerald',
    },
    { id: 'cost' as PageId, label: 'Cost Analysis', icon: DollarSign },
    {
      id: 'alerts' as PageId,
      label: 'Alerts',
      icon: AlertCircle,
      alertCount: unreadAlertCount,
    },
    { id: 'architecture' as PageId, label: 'Architecture', icon: Network },
    { id: 'documentation' as PageId, label: 'Documentation', icon: BookOpen },
  ];

  const handleItemClick = (id: PageId) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 md:static ${
          collapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
          <div
            onClick={() => handleItemClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(22,143,255,0.4)]">
              <Shield className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>Azure NAT Gateway</span>
                </div>
                <div className="truncate text-[10px] uppercase font-mono tracking-widest text-cyan-400">
                  Control Center
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {!collapsed && 'Core Networking'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-white border border-blue-500/30 shadow-[0_0_15px_rgba(22,143,255,0.15)]'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>

                    {/* Unread Alert badge */}
                    {item.alertCount !== undefined && item.alertCount > 0 && (
                      <span className="rounded-full bg-rose-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {item.alertCount}
                      </span>
                    )}

                    {/* Count badge */}
                    {item.count !== undefined && (
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                        {item.count}
                      </span>
                    )}

                    {/* SNAT badge */}
                    {item.badge && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold ${
                          item.badgeColor === 'rose'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : item.badgeColor === 'amber'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : item.badgeColor === 'emerald'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="border-t border-slate-800/80 p-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Azure Fabric Egress
                </span>
                <span className="font-mono text-cyan-400">20.45.123.10</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 leading-snug">
                Predictable IP allocated to 4 subnets in vnet-prod-eastus.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
