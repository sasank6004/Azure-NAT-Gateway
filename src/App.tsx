import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import type {
  DashboardData,
  NatGatewayDetails,
  SubnetItem,
  ConnectionListResponse,
  TrafficResponse,
  SnatResponse,
  CostResponse,
  AlertItem,
  NetworkHealthResponse,
  SimulationStatus,
  TopologyNode,
} from './types';

// Layout
import { Sidebar, type PageId } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';

// Common & Modals
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { ErrorBanner } from './components/common/ErrorBanner';
import { ToastContainer, type ToastMessage } from './components/common/Toast';
import { SimulationModal } from './components/modals/SimulationModal';
import { SearchModal } from './components/modals/SearchModal';
import { NodeDetailModal } from './components/modals/NodeDetailModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { NatGatewayPage } from './pages/NatGatewayPage';
import { SubnetsPage } from './pages/SubnetsPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { TrafficPage } from './pages/TrafficPage';
import { SnatPage } from './pages/SnatPage';
import { CostPage } from './pages/CostPage';
import { AlertsPage } from './pages/AlertsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { DocumentationPage } from './pages/DocumentationPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Layout states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Telemetry Data
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [gateway, setGateway] = useState<NatGatewayDetails | null>(null);
  const [subnets, setSubnets] = useState<SubnetItem[]>([]);
  const [connections, setConnections] = useState<ConnectionListResponse | null>(null);
  const [traffic, setTraffic] = useState<TrafficResponse | null>(null);
  const [snat, setSnat] = useState<SnatResponse | null>(null);
  const [cost, setCost] = useState<CostResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [networkHealth, setNetworkHealth] = useState<NetworkHealthResponse | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Subscribe to backend connectivity state
  useEffect(() => {
    const unsubscribe = api.subscribeStatus((connected) => {
      setIsBackendConnected(connected);
    });
    return unsubscribe;
  }, []);

  // Fetch all telemetry data
  const loadTelemetry = useCallback(async (showSkeleton = false) => {
    if (showSkeleton) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [
        dashRes,
        gwRes,
        subRes,
        connRes,
        trafRes,
        snatRes,
        costRes,
        altRes,
        healthRes,
        simRes,
      ] = await Promise.all([
        api.getDashboard(),
        api.getNatGateway(),
        api.getSubnets(),
        api.getConnections('all', 'all', 50),
        api.getTraffic('24h'),
        api.getSnat(),
        api.getCost(),
        api.getAlerts('all', 'all'),
        api.getNetworkHealth(),
        api.getSimulationStatus(),
      ]);

      setDashboard(dashRes);
      setGateway(gwRes);
      setSubnets(subRes);
      setConnections(connRes);
      setTraffic(trafRes);
      setSnat(snatRes);
      setCost(costRes);
      setAlerts(altRes);
      setNetworkHealth(healthRes);
      setSimulationStatus(simRes);
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTelemetry(true);
  }, [loadTelemetry]);

  // Periodic polling every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      loadTelemetry(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [loadTelemetry]);

  // Alert resolve action
  const handleResolveAlert = async (alertId: string) => {
    try {
      const res = await api.resolveAlert(alertId, 'DevOps Lead');
      if (res.success) {
        addToast('success', 'Incident Resolved', `Alert ${alertId} has been marked as resolved.`);
        setAlerts((prev) =>
          prev.map((a) =>
            a.id === alertId
              ? { ...a, status: 'RESOLVED', resolved_at: new Date().toISOString() }
              : a
          )
        );
        // Refresh health and dashboard to recalculate health score
        api.getDashboard().then(setDashboard);
        api.getNetworkHealth().then(setNetworkHealth);
      }
    } catch (err) {
      addToast('error', 'Resolve Failed', `Could not resolve alert ${alertId}.`);
    }
  };

  // Start simulation action
  const handleStartSimulation = async (load: string, duration: number) => {
    try {
      const status = await api.startSimulation(load, duration);
      setSimulationStatus(status);
      addToast(
        'info',
        'Simulation Running',
        `Started ${load} load stress simulation (${duration}s duration). Telemetry scaling active.`
      );
      loadTelemetry(false);
    } catch (err) {
      addToast('error', 'Simulation Error', 'Failed to start simulation run.');
    }
  };

  // Stop simulation action
  const handleStopSimulation = async () => {
    try {
      const status = await api.stopSimulation();
      setSimulationStatus(status);
      addToast('info', 'Simulation Stopped', 'Baseline production telemetry restored.');
      loadTelemetry(false);
    } catch (err) {
      addToast('error', 'Error', 'Failed to stop simulation.');
    }
  };

  const handleTimeframeChange = async (tf: string) => {
    try {
      const traf = await api.getTraffic(tf);
      setTraffic(traf);
    } catch (err) {
      console.warn('Failed to update timeframe', err);
    }
  };

  const unreadAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const currentSnatUtil = snat?.utilization_percentage || dashboard?.snat_utilization || 38.2;

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-600/40 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Simulation Modal */}
      <SimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        isSimulationActive={simulationStatus?.is_active || false}
        currentLoad={simulationStatus?.load || 'Medium'}
        remainingSeconds={simulationStatus?.remaining_seconds || 0}
        onStartSimulation={handleStartSimulation}
        onStopSimulation={handleStopSimulation}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={(page) => setCurrentPage(page)}
      />

      {/* Node Detail Modal */}
      <NodeDetailModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onNavigateToPage={(p) => setCurrentPage(p)}
      />

      {/* Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        unreadAlertCount={unreadAlertsCount}
        snatUtilization={currentSnatUtil}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar
          currentPage={currentPage}
          isBackendConnected={isBackendConnected}
          isSimulationActive={simulationStatus?.is_active || false}
          simulationLoad={simulationStatus?.load}
          remainingSeconds={simulationStatus?.remaining_seconds}
          unreadAlertCount={unreadAlertsCount}
          onOpenSimulation={() => setIsSimulationModalOpen(true)}
          onStopSimulation={handleStopSimulation}
          onRefreshData={() => {
            loadTelemetry(false);
            addToast('info', 'Telemetry Refreshed', 'Latest metrics retrieved from Azure control fabric.');
          }}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenAlerts={() => setCurrentPage('alerts')}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          isRefreshing={isRefreshing}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Connection Error notice if backend disconnected */}
          {!isBackendConnected && (
            <ErrorBanner
              isBackendOffline={true}
              onRetry={() => loadTelemetry(false)}
            />
          )}

          {isLoading ? (
            <LoadingSkeleton rows={5} />
          ) : (
            <>
              {currentPage === 'dashboard' && (
                <DashboardPage
                  data={dashboard}
                  traffic={traffic}
                  snat={snat}
                  alerts={alerts}
                  onNavigate={(p) => setCurrentPage(p)}
                  onOpenSimulation={() => setIsSimulationModalOpen(true)}
                  onSelectNode={(node) => setSelectedNode(node)}
                />
              )}

              {currentPage === 'nat-gateway' && (
                <NatGatewayPage
                  gateway={gateway}
                  onRefresh={() => loadTelemetry(false)}
                  isRefreshing={isRefreshing}
                />
              )}

              {currentPage === 'subnets' && (
                <SubnetsPage
                  subnets={subnets}
                  onSelectSubnet={(snet) => {
                    setSelectedNode({
                      id: snet.id,
                      label: snet.name,
                      type: 'subnet',
                      status: snet.status,
                      details: {
                        cidr: snet.cidr,
                        private_ip_range: snet.private_ip_range,
                        resources_count: snet.resources_count,
                        outbound_ip: snet.outbound_ip,
                        active_connections: snet.active_connections,
                      },
                    });
                  }}
                />
              )}

              {currentPage === 'connections' && (
                <ConnectionsPage
                  connectionsData={connections}
                  onRefresh={() => loadTelemetry(false)}
                  isRefreshing={isRefreshing}
                />
              )}

              {currentPage === 'traffic' && (
                <TrafficPage
                  trafficData={traffic}
                  onTimeframeChange={handleTimeframeChange}
                />
              )}

              {currentPage === 'snat' && (
                <SnatPage
                  snatData={snat}
                  onOpenSimulation={() => setIsSimulationModalOpen(true)}
                />
              )}

              {currentPage === 'cost' && <CostPage costData={cost} />}

              {currentPage === 'alerts' && (
                <AlertsPage
                  alerts={alerts}
                  onResolveAlert={handleResolveAlert}
                  onRefresh={() => loadTelemetry(false)}
                  isRefreshing={isRefreshing}
                />
              )}

              {currentPage === 'architecture' && (
                <ArchitecturePage
                  publicIps={dashboard?.public_ips || ['20.45.123.10', '20.45.123.11']}
                  activeConnections={dashboard?.active_connections || 1248}
                  onSelectNode={(node) => setSelectedNode(node)}
                />
              )}

              {currentPage === 'documentation' && <DocumentationPage />}
            </>
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Azure NAT Gateway Control Center</span>
            <span>•</span>
            <span>Predictable Outbound Connectivity Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Standard SKU</span>
            <span>•</span>
            <span>Zone Redundant (1, 2, 3)</span>
            <span>•</span>
            <span className="text-cyan-400">API v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
