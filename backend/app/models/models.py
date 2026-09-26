from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from app.database import Base

class NatGatewayModel(Base):
    __tablename__ = "nat_gateways"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, default="Healthy")
    region = Column(String, default="East US")
    resource_group = Column(String, default="rg-networking-prod")
    subscription_id = Column(String, default="sub-azure-90214-prod")
    sku = Column(String, default="Standard")
    zones = Column(String, default='["1", "2", "3"]')
    idle_timeout_minutes = Column(Integer, default=4)
    tcp_reset_enabled = Column(Boolean, default=True)
    public_ips = Column(String, default='["20.45.123.10", "20.45.123.11"]')
    current_throughput_mbps = Column(Float, default=184.2)
    active_connections = Column(Integer, default=1248)
    snat_utilization_pct = Column(Float, default=38.2)
    data_processed_gb = Column(Float, default=284.6)
    created_date = Column(String, default="2025-11-14T08:30:00Z")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SubnetModel(Base):
    __tablename__ = "subnets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    vnet_name = Column(String, default="vnet-prod-eastus")
    cidr = Column(String, nullable=False)
    private_ip_range = Column(String, nullable=False)
    resources_count = Column(Integer, default=0)
    outbound_ip = Column(String, default="20.45.123.10")
    active_connections = Column(Integer, default=0)
    status = Column(String, default="Healthy")
    description = Column(String, nullable=True)

class ConnectionModel(Base):
    __tablename__ = "connections"

    id = Column(String, primary_key=True, index=True)
    source_ip = Column(String, nullable=False)
    source_subnet = Column(String, nullable=False)
    destination_ip = Column(String, nullable=False)
    destination_host = Column(String, nullable=False)
    protocol = Column(String, default="TCP")
    destination_port = Column(Integer, nullable=False)
    snat_port = Column(Integer, nullable=False)
    status = Column(String, default="Established") # Established, Closed, Failed, Time_Wait
    bytes_transferred = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=12)
    timestamp = Column(String, nullable=False)

class TrafficMetricModel(Base):
    __tablename__ = "traffic_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    time_label = Column(String, nullable=False)
    outbound_mbps = Column(Float, nullable=False)
    requests_per_min = Column(Integer, nullable=False)
    active_connections = Column(Integer, nullable=False)
    data_processed_gb = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class SnatMetricModel(Base):
    __tablename__ = "snat_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    time_label = Column(String, nullable=False)
    total_ports = Column(Integer, default=129024)
    used_ports = Column(Integer, nullable=False)
    available_ports = Column(Integer, nullable=False)
    utilization_pct = Column(Float, nullable=False)
    allocation_rate_per_sec = Column(Float, default=12.4)
    risk_level = Column(String, default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    failed_allocations = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CostMetricModel(Base):
    __tablename__ = "cost_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date_label = Column(String, nullable=False)
    gateway_hours = Column(Float, default=24.0)
    gateway_cost = Column(Float, default=1.08) # $0.045/hr * 24 = $1.08
    data_processed_gb = Column(Float, default=12.5)
    data_cost = Column(Float, default=0.56) # $0.045/GB
    total_cost = Column(Float, default=1.64)

class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    alert_type = Column(String, nullable=False)
    severity = Column(String, default="INFO") # INFO, WARNING, HIGH, CRITICAL
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    component = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    status = Column(String, default="ACTIVE") # ACTIVE, RESOLVED
    resolved_at = Column(String, nullable=True)
