from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DashboardResponse(BaseModel):
    network_health: int
    gateway_status: str
    public_ip: str
    public_ips: List[str]
    active_connections: int
    snat_utilization: float
    data_processed_gb: float
    monthly_cost: float
    region: str
    resource_group: str
    is_simulation_active: bool = False
    environment: str = "DEMO / SIMULATED ENVIRONMENT"

class NatGatewayResponse(BaseModel):
    id: str
    name: str
    status: str
    region: str
    resource_group: str
    subscription_id: str
    sku: str
    zones: List[str]
    idle_timeout_minutes: int
    tcp_reset_enabled: bool
    public_ips: List[str]
    attached_subnets_count: int
    attached_subnets: List[str]
    current_throughput_mbps: float
    active_connections: int
    snat_utilization_pct: float
    data_processed_gb: float
    created_date: str
    environment: str = "DEMO / SIMULATED"

class SubnetResponse(BaseModel):
    id: str
    name: str
    vnet_name: str
    cidr: str
    private_ip_range: str
    resources_count: int
    outbound_ip: str
    active_connections: int
    status: str
    description: Optional[str] = None

class ConnectionItem(BaseModel):
    id: str
    source_ip: str
    source_subnet: str
    destination_ip: str
    destination_host: str
    protocol: str
    destination_port: int
    snat_port: int
    status: str
    bytes_transferred: int
    duration_seconds: int
    timestamp: str

class ConnectionListResponse(BaseModel):
    total_connections: int
    active_connections: int
    failed_connections: int
    connections_per_minute: int
    avg_connection_duration_sec: float
    items: List[ConnectionItem]

class TrafficMetricPoint(BaseModel):
    time: str
    traffic_mbps: float
    requests_per_min: int
    connections: int
    data_processed_gb: float

class TopDestination(BaseModel):
    host: str
    ip: str
    requests: int
    category: str
    percentage: float

class TrafficResponse(BaseModel):
    timeframe: str
    metrics: List[TrafficMetricPoint]
    top_destinations: List[TopDestination]
    total_data_processed_gb: float
    peak_throughput_mbps: float

class SnatMetricPoint(BaseModel):
    time: str
    used_ports: int
    available_ports: int
    utilization_pct: float

class SnatResponse(BaseModel):
    total_snat_ports: int
    used_ports: int
    available_ports: int
    utilization_percentage: float
    port_allocation_rate_per_sec: float
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    failed_allocations_count: int
    public_ip_count: int
    ports_per_ip: int = 64512
    history: List[SnatMetricPoint]

class DailyCostPoint(BaseModel):
    day: str
    gateway_cost: float
    data_cost: float
    total: float

class CostBreakdown(BaseModel):
    gateway_hours: float
    gateway_rate_per_hour: float
    gateway_subtotal: float
    data_processed_gb: float
    data_rate_per_gb: float
    data_subtotal: float
    currency: str = "USD"
    total: float

class CostResponse(BaseModel):
    current_month_cost: float
    estimated_monthly_cost: float
    nat_gateway_hours: float
    data_processed_gb: float
    data_processing_cost: float
    gateway_cost: float
    currency: str = "USD"
    breakdown: CostBreakdown
    daily_trend: List[DailyCostPoint]
    is_simulated: bool = True

class AlertItem(BaseModel):
    id: str
    alert_type: str
    severity: str  # INFO, WARNING, HIGH, CRITICAL
    title: str
    description: str
    component: str
    timestamp: str
    status: str    # ACTIVE, RESOLVED
    resolved_at: Optional[str] = None

class AlertResolveRequest(BaseModel):
    resolved_by: Optional[str] = "OpsEngineer"
    note: Optional[str] = "Manually resolved via Azure NAT Gateway Console"

class HealthFactor(BaseModel):
    name: str
    score: int
    weight_pct: int
    status: str
    impact: str

class NetworkHealthResponse(BaseModel):
    overall_score: int
    status_label: str  # Optimal, Healthy, Warning, Degraded, Critical
    calculation_timestamp: str
    factors: List[HealthFactor]
    summary_message: str

class SimulationRequest(BaseModel):
    load: str = "Medium"  # Low, Medium, High
    duration_seconds: int = 60  # 30, 60, 300

class SimulationStatusResponse(BaseModel):
    is_active: bool
    load: str
    duration_seconds: int
    remaining_seconds: int
    snat_utilization_target: float
    active_connections: int
    message: str

class TopologyNode(BaseModel):
    id: str
    label: str
    type: str  # internet, public_ip, nat_gateway, vnet, subnet, resource
    status: str
    details: Dict[str, Any]

class TopologyLink(BaseModel):
    source: str
    target: str
    label: str
    flow_direction: str = "outbound"
    active_flows: int

class ArchitectureResponse(BaseModel):
    vnet_name: str
    vnet_cidr: str
    nat_gateway_name: str
    public_ips: List[str]
    nodes: List[TopologyNode]
    links: List[TopologyLink]
    data_flow_explanation: List[str]
