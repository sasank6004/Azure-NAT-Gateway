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
  ArchitectureResponse
} from '../types';
import {
  mockDashboard,
  mockNatGateway,
  mockSubnets,
  mockConnections,
  mockTraffic,
  mockSnat,
  mockCost,
  mockAlerts,
  mockNetworkHealth,
  mockArchitecture,
} from './fallbackData';

const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

class ApiService {
  private isConnected = false;
  private statusListeners: Array<(connected: boolean) => void> = [];

  // In-memory simulation state for fallback mode
  private simActive = false;
  private simLoad = 'Medium';
  private simRemaining = 0;
  private simTimer: any = null;
  private activeAlertsList = [...mockAlerts];

  constructor() {
    // Initial health check
    this.checkHealth().catch(() => {});
  }

  public subscribeStatus(listener: (connected: boolean) => void) {
    this.statusListeners.push(listener);
    listener(this.isConnected);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private setConnected(status: boolean) {
    if (this.isConnected !== status) {
      this.isConnected = status;
      this.statusListeners.forEach((l) => l(status));
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.setConnected(true);
      return data as T;
    } catch (err) {
      this.setConnected(false);
      throw err;
    }
  }

  async checkHealth(): Promise<{ status: string; service: string }> {
    try {
      const res = await this.request<{ status: string; service: string }>('/health');
      this.setConnected(true);
      return res;
    } catch (e) {
      this.setConnected(false);
      return { status: 'fallback', service: 'in-browser-sim' };
    }
  }

  async getDashboard(): Promise<DashboardData> {
    try {
      return await this.request<DashboardData>('/dashboard');
    } catch {
      const mult = this.simActive ? (this.simLoad === 'Low' ? 1.3 : this.simLoad === 'Medium' ? 2.2 : 3.9) : 1.0;
      return {
        ...mockDashboard,
        active_connections: Math.round(mockDashboard.active_connections * mult),
        snat_utilization: this.simActive 
          ? (this.simLoad === 'Low' ? 48.0 : this.simLoad === 'Medium' ? 72.4 : 89.7)
          : mockDashboard.snat_utilization,
        data_processed_gb: Math.round((mockDashboard.data_processed_gb + (mult - 1) * 15) * 10) / 10,
        monthly_cost: Math.round((mockDashboard.monthly_cost + (mult - 1) * 6.5) * 100) / 100,
        is_simulation_active: this.simActive,
      };
    }
  }

  async getNatGateway(): Promise<NatGatewayDetails> {
    try {
      return await this.request<NatGatewayDetails>('/nat-gateway');
    } catch {
      const mult = this.simActive ? (this.simLoad === 'Low' ? 1.3 : this.simLoad === 'Medium' ? 2.2 : 3.9) : 1.0;
      return {
        ...mockNatGateway,
        active_connections: Math.round(mockNatGateway.active_connections * mult),
        current_throughput_mbps: Math.round(mockNatGateway.current_throughput_mbps * mult * 10) / 10,
        snat_utilization_pct: this.simActive 
          ? (this.simLoad === 'Low' ? 48.0 : this.simLoad === 'Medium' ? 72.4 : 89.7)
          : mockNatGateway.snat_utilization_pct,
      };
    }
  }

  async getSubnets(): Promise<SubnetItem[]> {
    try {
      return await this.request<SubnetItem[]>('/subnets');
    } catch {
      const mult = this.simActive ? (this.simLoad === 'Low' ? 1.3 : this.simLoad === 'Medium' ? 2.2 : 3.9) : 1.0;
      return mockSubnets.map((s) => ({
        ...s,
        active_connections: Math.round(s.active_connections * mult),
      }));
    }
  }

  async getConnections(status?: string, protocol?: string, limit = 50): Promise<ConnectionListResponse> {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (protocol && protocol !== 'all') params.append('protocol', protocol);
      params.append('limit', limit.toString());
      return await this.request<ConnectionListResponse>(`/connections?${params.toString()}`);
    } catch {
      let filtered = [...mockConnections.items];
      if (status && status !== 'all') {
        filtered = filtered.filter((i) => i.status.toLowerCase() === status.toLowerCase());
      }
      if (protocol && protocol !== 'all') {
        filtered = filtered.filter((i) => i.protocol.toLowerCase() === protocol.toLowerCase());
      }
      return {
        ...mockConnections,
        items: filtered.slice(0, limit),
      };
    }
  }

  async getTraffic(timeframe = '24h'): Promise<TrafficResponse> {
    try {
      return await this.request<TrafficResponse>(`/traffic?timeframe=${encodeURIComponent(timeframe)}`);
    } catch {
      const mult = this.simActive ? (this.simLoad === 'Low' ? 1.3 : this.simLoad === 'Medium' ? 2.2 : 3.9) : 1.0;
      return {
        ...mockTraffic,
        timeframe,
        metrics: mockTraffic.metrics.map((m) => ({
          ...m,
          traffic_mbps: Math.round(m.traffic_mbps * mult * 10) / 10,
          requests_per_min: Math.round(m.requests_per_min * mult),
          connections: Math.round(m.connections * mult),
        })),
      };
    }
  }

  async getSnat(): Promise<SnatResponse> {
    try {
      return await this.request<SnatResponse>('/snat');
    } catch {
      const mult = this.simActive ? (this.simLoad === 'Low' ? 1.3 : this.simLoad === 'Medium' ? 2.2 : 3.9) : 1.0;
      const util = this.simActive
        ? (this.simLoad === 'Low' ? 48.0 : this.simLoad === 'Medium' ? 72.4 : 89.7)
        : 38.2;
      const used = Math.round(mockSnat.total_snat_ports * (util / 100));
      const avail = mockSnat.total_snat_ports - used;
      const risk = util < 50 ? 'LOW' : util < 75 ? 'MEDIUM' : util < 90 ? 'HIGH' : 'CRITICAL';

      return {
        ...mockSnat,
        used_ports: used,
        available_ports: avail,
        utilization_percentage: util,
        risk_level: risk,
        port_allocation_rate_per_sec: Math.round(mockSnat.port_allocation_rate_per_sec * mult * 10) / 10,
        failed_allocations_count: risk === 'HIGH' ? 3 : risk === 'CRITICAL' ? 28 : 0,
      };
    }
  }

  async getCost(): Promise<CostResponse> {
    try {
      return await this.request<CostResponse>('/cost');
    } catch {
      return mockCost;
    }
  }

  async getAlerts(status?: string, severity?: string): Promise<AlertItem[]> {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (severity && severity !== 'all') params.append('severity', severity);
      return await this.request<AlertItem[]>(`/alerts?${params.toString()}`);
    } catch {
      let filtered = [...this.activeAlertsList];
      if (status && status !== 'all') {
        filtered = filtered.filter((a) => a.status === status.toUpperCase());
      }
      if (severity && severity !== 'all') {
        filtered = filtered.filter((a) => a.severity === severity.toUpperCase());
      }
      return filtered;
    }
  }

  async resolveAlert(alertId: string, resolvedBy = 'OpsEngineer'): Promise<{ success: boolean; message: string }> {
    try {
      return await this.request<{ success: boolean; message: string }>(`/alerts/${alertId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ resolved_by: resolvedBy }),
      });
    } catch {
      this.activeAlertsList = this.activeAlertsList.map((a) =>
        a.id === alertId ? { ...a, status: 'RESOLVED', resolved_at: new Date().toISOString() } : a
      );
      return { success: true, message: `Alert ${alertId} resolved in fallback mode` };
    }
  }

  async getNetworkHealth(): Promise<NetworkHealthResponse> {
    try {
      return await this.request<NetworkHealthResponse>('/network-health');
    } catch {
      const score = this.simActive ? (this.simLoad === 'Low' ? 95 : this.simLoad === 'Medium' ? 84 : 64) : 98;
      const status = score >= 95 ? 'Optimal' : score >= 85 ? 'Healthy' : score >= 70 ? 'Warning' : 'Degraded';
      return {
        ...mockNetworkHealth,
        overall_score: score,
        status_label: status,
      };
    }
  }

  async getSimulationStatus(): Promise<SimulationStatus> {
    try {
      return await this.request<SimulationStatus>('/simulation/status');
    } catch {
      return {
        is_active: this.simActive,
        load: this.simLoad,
        duration_seconds: 60,
        remaining_seconds: this.simRemaining,
        snat_utilization_target: this.simLoad === 'Low' ? 48.0 : this.simLoad === 'Medium' ? 72.4 : 89.7,
        active_connections: this.simLoad === 'Low' ? 1850 : this.simLoad === 'Medium' ? 3980 : 8450,
        message: this.simActive ? `Simulating ${this.simLoad} load in fallback sandbox` : 'Simulation idle',
      };
    }
  }

  async startSimulation(load = 'Medium', durationSeconds = 60): Promise<SimulationStatus> {
    try {
      return await this.request<SimulationStatus>('/simulation/start', {
        method: 'POST',
        body: JSON.stringify({ load, duration_seconds: durationSeconds }),
      });
    } catch {
      this.simActive = true;
      this.simLoad = load;
      this.simRemaining = durationSeconds;
      if (this.simTimer) clearInterval(this.simTimer);
      this.simTimer = setInterval(() => {
        this.simRemaining--;
        if (this.simRemaining <= 0) {
          this.simActive = false;
          clearInterval(this.simTimer);
        }
      }, 1000);

      return {
        is_active: true,
        load,
        duration_seconds: durationSeconds,
        remaining_seconds: durationSeconds,
        snat_utilization_target: load === 'Low' ? 48.0 : load === 'Medium' ? 72.4 : 89.7,
        active_connections: load === 'Low' ? 1850 : load === 'Medium' ? 3980 : 8450,
        message: `Simulation started for ${durationSeconds}s at ${load} load.`,
      };
    }
  }

  async stopSimulation(): Promise<SimulationStatus> {
    try {
      return await this.request<SimulationStatus>('/simulation/stop', {
        method: 'POST',
      });
    } catch {
      this.simActive = false;
      this.simRemaining = 0;
      if (this.simTimer) clearInterval(this.simTimer);
      return {
        is_active: false,
        load: 'Off',
        duration_seconds: 0,
        remaining_seconds: 0,
        snat_utilization_target: 38.2,
        active_connections: 1248,
        message: 'Simulation stopped.',
      };
    }
  }

  async getArchitecture(): Promise<ArchitectureResponse> {
    try {
      return await this.request<ArchitectureResponse>('/architecture');
    } catch {
      return mockArchitecture;
    }
  }
}

export const api = new ApiService();
