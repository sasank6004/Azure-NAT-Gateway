import React from 'react';
import {
  Bell,
  Search,
  Play,
  Square,
  RefreshCw,
  Radio,
  Server,
  Menu,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  isBackendConnected: boolean;
  isSimulationActive: boolean;
  simulationLoad?: string;
  remainingSeconds?: number;
  unreadAlertCount: number;
  onOpenSimulation: () => void;
  onStopSimulation: () => void;
  onRefreshData: () => void;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  isBackendConnected,
  isSimulationActive,
  simulationLoad,
  remainingSeconds,
  unreadAlertCount,
  onOpenSimulation,
  onStopSimulation,
  onRefreshData,
  onOpenSearch,
  onOpenAlerts,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isRefreshing = false,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 md:px-6 backdrop-blur-xl">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-blue-400 font-semibold tracking-wide">Azure Portal</span>
          <span>/</span>
          <span className="text-slate-300">Networking</span>
          <span>/</span>
          <span className="font-semibold text-white capitalize">{currentPage.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Center: Search & Environment Badge */}
      <div className="flex items-center gap-3">
        {/* Environment Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/40 px-3 py-1 text-[11px] font-medium text-sky-300">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>DEMO ENVIRONMENT</span>
          <span className="text-sky-500/80">|</span>
          <span className="text-slate-400 font-mono text-[10px]">East US</span>
        </div>

        {/* Backend Status indicator */}
        <div
          title={
            isBackendConnected
              ? 'FastAPI Backend is online at http://localhost:8000'
              : 'FastAPI Backend offline - operating with interactive client simulation'
          }
          className={`hidden md:flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            isBackendConnected
              ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400'
              : 'border-amber-500/30 bg-amber-950/30 text-amber-300'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isBackendConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
            }`}
          />
          <Server className="h-3 w-3" />
          <span>{isBackendConnected ? 'FastAPI: Live' : 'Sandbox Mode'}</span>
        </div>

        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search resources, subnets, IPs...</span>
          <kbd className="hidden sm:inline rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Simulation Controls & Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Simulation button */}
        {isSimulationActive ? (
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 px-3 py-1.5 text-xs text-amber-300">
            <Radio className="h-3.5 w-3.5 text-amber-400 animate-spin" />
            <span className="font-semibold">{simulationLoad} Load</span>
            {remainingSeconds !== undefined && remainingSeconds > 0 && (
              <span className="font-mono text-[11px] bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-200">
                {remainingSeconds}s
              </span>
            )}
            <button
              onClick={onStopSimulation}
              title="Stop Simulation"
              className="ml-1 rounded p-1 hover:bg-amber-800/50 text-amber-200 transition-colors"
            >
              <Square className="h-3 w-3 fill-amber-300" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-600/20 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-600/30 transition-all cursor-pointer shadow-[0_0_12px_rgba(22,143,255,0.2)]"
          >
            <Play className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
            <span className="hidden sm:inline">Run Simulation</span>
          </button>
        )}

        {/* Refresh button */}
        <button
          onClick={onRefreshData}
          title="Refresh Telemetry"
          className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:border-slate-700 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
        </button>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          title="Alert Center"
          className="relative rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:border-slate-700 hover:text-white transition-all cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-700 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="hidden xl:block text-left text-xs leading-tight">
            <div className="font-semibold text-slate-200">Cloud Ops</div>
            <div className="text-[10px] text-slate-400">East US Prod</div>
          </div>
        </div>
      </div>
    </header>
  );
};
