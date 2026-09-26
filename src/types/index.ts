export type GatewayStatus = 'Healthy' | 'Warning' | 'Degraded' | 'Critical';
export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'RESOLVED';
export type ConnectionStatus = 'Established' | 'Closed' | 'Failed' | 'Time_Wait';
export type SnatRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DashboardData {
  network_health: number;
  gateway_status: GatewayStatus;
  public_ip: string;
  public_ips: string[];
  active_connections: number;
  snat_utilization: number;
  data_processed_gb: number;
  monthly_cost: number;
  region: string;
  resource_group: string;
  is_simulation_active: boolean;
  environment: string;
}

export interface NatGatewayDetails {
  id: string;
  name: string;
  status: GatewayStatus;
  region: string;
  resource_group: string;
  subscription_id: string;
  sku: string;
  zones: string[];
  idle_timeout_minutes: number;
  tcp_reset_enabled: boolean;
  public_ips: string[];
  attached_subnets_count: number;
  attached_subnets: string[];
  current_throughput_mbps: number;
  active_connections: number;
  snat_utilization_pct: number;
  data_processed_gb: number;
  created_date: string;
  environment: string;
}

export interface SubnetItem {
  id: string;
  name: string;
  vnet_name: string;
  cidr: string;
  private_ip_range: string;
  resources_count: number;
  outbound_ip: string;
  active_connections: number;
  status: string;
  description?: string;
}

export interface ConnectionLog {
  id: string;
  source_ip: string;
  source_subnet: string;
  destination_ip: string;
  destination_host: string;
  protocol: string;
  destination_port: number;
  snat_port: number;
  status: ConnectionStatus;
  bytes_transferred: number;
  duration_seconds: number;
  timestamp: string;
}

export interface ConnectionListResponse {
  total_connections: number;
  active_connections: number;
  failed_connections: number;
  connections_per_minute: number;
  avg_connection_duration_sec: number;
  items: ConnectionLog[];
}

export interface TrafficPoint {
  time: string;
  traffic_mbps: number;
  requests_per_min: number;
  connections: number;
  data_processed_gb: number;
}

export interface TopDestination {
  host: string;
  ip: string;
  requests: number;
  category: string;
  percentage: number;
}

export interface TrafficResponse {
  timeframe: string;
  metrics: TrafficPoint[];
  top_destinations: TopDestination[];
  total_data_processed_gb: number;
  peak_throughput_mbps: number;
}

export interface SnatPoint {
  time: string;
  used_ports: number;
  available_ports: number;
  utilization_pct: number;
}

export interface SnatResponse {
  total_snat_ports: number;
  used_ports: number;
  available_ports: number;
  utilization_percentage: number;
  port_allocation_rate_per_sec: number;
  risk_level: SnatRiskLevel;
  failed_allocations_count: number;
  public_ip_count: number;
  ports_per_ip: number;
  history: SnatPoint[];
}

export interface DailyCostPoint {
  day: string;
  gateway_cost: number;
  data_cost: number;
  total: number;
}

export interface CostBreakdown {
  gateway_hours: number;
  gateway_rate_per_hour: number;
  gateway_subtotal: number;
  data_processed_gb: number;
  data_rate_per_gb: number;
  data_subtotal: number;
  currency: string;
  total: number;
}

export interface CostResponse {
  current_month_cost: number;
  estimated_monthly_cost: number;
  nat_gateway_hours: number;
  data_processed_gb: number;
  data_processing_cost: number;
  gateway_cost: number;
  currency: string;
  breakdown: CostBreakdown;
  daily_trend: DailyCostPoint[];
  is_simulated: boolean;
}

export interface AlertItem {
  id: string;
  alert_type: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  component: string;
  timestamp: string;
  status: AlertStatus;
  resolved_at?: string | null;
}

export interface HealthFactor {
  name: string;
  score: number;
  weight_pct: number;
  status: string;
  impact: string;
}

export interface NetworkHealthResponse {
  overall_score: number;
  status_label: string;
  calculation_timestamp: string;
  factors: HealthFactor[];
  summary_message: string;
}

export interface SimulationStatus {
  is_active: boolean;
  load: string;
  duration_seconds: number;
  remaining_seconds: number;
  snat_utilization_target: number;
  active_connections: number;
  message: string;
}

export interface TopologyNode {
  id: string;
  label: string;
  type: 'internet' | 'public_ip' | 'nat_gateway' | 'vnet' | 'subnet' | 'resource';
  status: string;
  details: Record<string, any>;
}

export interface TopologyLink {
  source: string;
  target: string;
  label: string;
  flow_direction: string;
  active_flows: number;
}

export interface ArchitectureResponse {
  vnet_name: string;
  vnet_cidr: string;
  nat_gateway_name: string;
  public_ips: string[];
  nodes: TopologyNode[];
  links: TopologyLink[];
  data_flow_explanation: string[];
}
