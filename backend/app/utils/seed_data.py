import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import (
    NatGatewayModel,
    SubnetModel,
    ConnectionModel,
    TrafficMetricModel,
    SnatMetricModel,
    CostMetricModel,
    AlertModel
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(NatGatewayModel).first():
        return

    # 1. NAT Gateway
    gateway = NatGatewayModel(
        id="nat-gw-prod-eastus",
        name="nat-gw-prod-eastus",
        status="Healthy",
        region="East US",
        resource_group="rg-networking-prod",
        subscription_id="sub-azure-90214-prod",
        sku="Standard",
        zones=json.dumps(["1", "2", "3"]),
        idle_timeout_minutes=4,
        tcp_reset_enabled=True,
        public_ips=json.dumps(["20.45.123.10", "20.45.123.11"]),
        current_throughput_mbps=184.6,
        active_connections=1248,
        snat_utilization_pct=38.2,
        data_processed_gb=284.6,
        created_date="2025-11-14T08:30:00Z"
    )
    db.add(gateway)

    # 2. Subnets
    subnets = [
        SubnetModel(
            id="snet-frontend",
            name="frontend-subnet",
            vnet_name="vnet-prod-eastus",
            cidr="10.0.1.0/24",
            private_ip_range="10.0.1.4 - 10.0.1.254",
            resources_count=24,
            outbound_ip="20.45.123.10",
            active_connections=428,
            status="Healthy",
            description="Public-facing web applications & ingress proxies with dedicated egress NAT"
        ),
        SubnetModel(
            id="snet-backend",
            name="backend-subnet",
            vnet_name="vnet-prod-eastus",
            cidr="10.0.2.0/24",
            private_ip_range="10.0.2.4 - 10.0.2.254",
            resources_count=18,
            outbound_ip="20.45.123.10",
            active_connections=512,
            status="Healthy",
            description="Microservices API tier communicating with third-party payment & auth APIs"
        ),
        SubnetModel(
            id="snet-database",
            name="database-subnet",
            vnet_name="vnet-prod-eastus",
            cidr="10.0.3.0/24",
            private_ip_range="10.0.3.4 - 10.0.3.254",
            resources_count=8,
            outbound_ip="20.45.123.10",
            active_connections=308,
            status="Healthy",
            description="Managed databases & read replicas performing external backup syncs"
        ),
        SubnetModel(
            id="snet-aks-nodes",
            name="aks-nodes-subnet",
            vnet_name="vnet-prod-eastus",
            cidr="10.0.4.0/24",
            private_ip_range="10.0.4.4 - 10.0.4.254",
            resources_count=32,
            outbound_ip="20.45.123.11",
            active_connections=620,
            status="Healthy",
            description="Azure Kubernetes Service worker nodes pulling container images and telemetry"
        )
    ]
    db.add_all(subnets)

    # 3. Connection logs
    connections = [
        ConnectionModel(
            id="conn-1001",
            source_ip="10.0.2.14",
            source_subnet="backend-subnet",
            destination_ip="54.187.205.235",
            destination_host="api.stripe.com",
            protocol="TCP",
            destination_port=443,
            snat_port=49210,
            status="Established",
            bytes_transferred=845200,
            duration_seconds=18,
            timestamp="Just now"
        ),
        ConnectionModel(
            id="conn-1002",
            source_ip="10.0.2.19",
            source_subnet="backend-subnet",
            destination_ip="20.190.159.0",
            destination_host="login.microsoftonline.com",
            protocol="TCP",
            destination_port=443,
            snat_port=49211,
            status="Established",
            bytes_transferred=124000,
            duration_seconds=6,
            timestamp="10s ago"
        ),
        ConnectionModel(
            id="conn-1003",
            source_ip="10.0.4.31",
            source_subnet="aks-nodes-subnet",
            destination_ip="140.82.113.4",
            destination_host="api.github.com",
            protocol="TCP",
            destination_port=443,
            snat_port=51402,
            status="Established",
            bytes_transferred=458920,
            duration_seconds=22,
            timestamp="25s ago"
        ),
        ConnectionModel(
            id="conn-1004",
            source_ip="10.0.1.8",
            source_subnet="frontend-subnet",
            destination_ip="104.16.27.35",
            destination_host="registry.npmjs.org",
            protocol="TCP",
            destination_port=443,
            snat_port=52119,
            status="Closed",
            bytes_transferred=3420000,
            duration_seconds=45,
            timestamp="1m ago"
        ),
        ConnectionModel(
            id="conn-1005",
            source_ip="10.0.3.12",
            source_subnet="database-subnet",
            destination_ip="52.239.144.18",
            destination_host="blob.core.windows.net",
            protocol="TCP",
            destination_port=443,
            snat_port=53001,
            status="Established",
            bytes_transferred=18240000,
            duration_seconds=120,
            timestamp="2m ago"
        ),
        ConnectionModel(
            id="conn-1006",
            source_ip="10.0.2.45",
            source_subnet="backend-subnet",
            destination_ip="34.120.89.12",
            destination_host="api.sendgrid.com",
            protocol="TCP",
            destination_port=587,
            snat_port=53140,
            status="Closed",
            bytes_transferred=32000,
            duration_seconds=4,
            timestamp="3m ago"
        ),
        ConnectionModel(
            id="conn-1007",
            source_ip="10.0.4.15",
            source_subnet="aks-nodes-subnet",
            destination_ip="52.84.162.77",
            destination_host="index.docker.io",
            protocol="TCP",
            destination_port=443,
            snat_port=53890,
            status="Established",
            bytes_transferred=68400000,
            duration_seconds=240,
            timestamp="4m ago"
        ),
        ConnectionModel(
            id="conn-1008",
            source_ip="10.0.1.22",
            source_subnet="frontend-subnet",
            destination_ip="151.101.65.140",
            destination_host="api.datadoghq.com",
            protocol="TCP",
            destination_port=443,
            snat_port=54012,
            status="Time_Wait",
            bytes_transferred=78500,
            duration_seconds=3,
            timestamp="5m ago"
        ),
        ConnectionModel(
            id="conn-1009",
            source_ip="10.0.2.8",
            source_subnet="backend-subnet",
            destination_ip="198.51.100.44",
            destination_host="legacy-partner-api.com",
            protocol="TCP",
            destination_port=8443,
            snat_port=54220,
            status="Failed",
            bytes_transferred=0,
            duration_seconds=30,
            timestamp="8m ago"
        ),
        ConnectionModel(
            id="conn-1010",
            source_ip="10.0.4.5",
            source_subnet="aks-nodes-subnet",
            destination_ip="1.1.1.1",
            destination_host="one.one.one.one",
            protocol="UDP",
            destination_port=53,
            snat_port=54900,
            status="Closed",
            bytes_transferred=512,
            duration_seconds=1,
            timestamp="10m ago"
        )
    ]
    db.add_all(connections)

    # 4. Traffic Metrics (Past 24 hours in 4-hour intervals)
    traffic_points = [
        {"time": "00:00", "traffic": 78.4, "requests": 14200, "conns": 780, "data": 24.2},
        {"time": "04:00", "traffic": 54.1, "requests": 9800, "conns": 540, "data": 38.5},
        {"time": "08:00", "traffic": 142.8, "requests": 28600, "conns": 1120, "data": 78.0},
        {"time": "12:00", "traffic": 196.2, "requests": 41200, "conns": 1450, "data": 142.6},
        {"time": "16:00", "traffic": 218.5, "requests": 48900, "conns": 1680, "data": 210.4},
        {"time": "20:00", "traffic": 164.2, "requests": 34100, "conns": 1310, "data": 258.9},
        {"time": "24:00", "traffic": 184.6, "requests": 37800, "conns": 1248, "data": 284.6},
    ]
    for tp in traffic_points:
        db.add(TrafficMetricModel(
            time_label=tp["time"],
            outbound_mbps=tp["traffic"],
            requests_per_min=tp["requests"],
            active_connections=tp["conns"],
            data_processed_gb=tp["data"]
        ))

    # 5. SNAT Metrics
    snat_points = [
        {"time": "00:00", "used": 28400, "total": 129024, "rate": 8.2},
        {"time": "04:00", "used": 21100, "total": 129024, "rate": 6.1},
        {"time": "08:00", "used": 39500, "total": 129024, "rate": 14.5},
        {"time": "12:00", "used": 47200, "total": 129024, "rate": 18.2},
        {"time": "16:00", "used": 54100, "total": 129024, "rate": 21.0},
        {"time": "20:00", "used": 44800, "total": 129024, "rate": 15.4},
        {"time": "24:00", "used": 49287, "total": 129024, "rate": 16.8},
    ]
    for sp in snat_points:
        avail = sp["total"] - sp["used"]
        util = round((sp["used"] / sp["total"]) * 100, 1)
        risk = "LOW" if util < 50 else ("MEDIUM" if util < 75 else ("HIGH" if util < 90 else "CRITICAL"))
        db.add(SnatMetricModel(
            time_label=sp["time"],
            total_ports=sp["total"],
            used_ports=sp["used"],
            available_ports=avail,
            utilization_pct=util,
            allocation_rate_per_sec=sp["rate"],
            risk_level=risk,
            failed_allocations=0
        ))

    # 6. Cost Metrics (Past 7 days)
    costs = [
        {"day": "Day -6", "gw_hours": 24.0, "data_gb": 32.4},
        {"day": "Day -5", "gw_hours": 24.0, "data_gb": 36.1},
        {"day": "Day -4", "gw_hours": 24.0, "data_gb": 41.5},
        {"day": "Day -3", "gw_hours": 24.0, "data_gb": 45.8},
        {"day": "Day -2", "gw_hours": 24.0, "data_gb": 40.2},
        {"day": "Yesterday", "gw_hours": 24.0, "data_gb": 44.0},
        {"day": "Today", "gw_hours": 18.5, "data_gb": 44.6},
    ]
    for c in costs:
        gw_c = round(c["gw_hours"] * 0.045, 2)
        dt_c = round(c["data_gb"] * 0.045, 2)
        db.add(CostMetricModel(
            date_label=c["day"],
            gateway_hours=c["gw_hours"],
            gateway_cost=gw_c,
            data_processed_gb=c["data_gb"],
            data_cost=dt_c,
            total_cost=round(gw_c + dt_c, 2)
        ))

    # 7. Alerts
    alerts = [
        AlertModel(
            id="ALT-2041",
            alert_type="SNAT Port Utilization",
            severity="WARNING",
            title="SNAT Port Utilization Approaching Warning Threshold (38.2%)",
            description="Peak SNAT port utilization across frontend-subnet reached 49,287 ports. Headroom remains healthy with 79,737 ports free across 2 public IPs.",
            component="nat-gw-prod-eastus / frontend-subnet",
            timestamp="12 minutes ago",
            status="ACTIVE"
        ),
        AlertModel(
            id="ALT-2040",
            alert_type="High Outbound Traffic",
            severity="INFO",
            title="Sustained Outbound Throughput Spike (184 Mbps)",
            description="Outbound bandwidth sustained above 150 Mbps for 10 minutes due to scheduled database snapshot export to Azure Blob Storage.",
            component="database-subnet",
            timestamp="34 minutes ago",
            status="ACTIVE"
        ),
        AlertModel(
            id="ALT-2039",
            alert_type="Cost Threshold",
            severity="WARNING",
            title="Monthly NAT Gateway Spend Forecast Reached 65% of Budget",
            description="Current month accrued spend is $42.80 against target budget cap of $65.00 with 11 days remaining in cycle.",
            component="Cost Management",
            timestamp="2 hours ago",
            status="ACTIVE"
        ),
        AlertModel(
            id="ALT-2038",
            alert_type="Gateway Health",
            severity="INFO",
            title="Availability Zone Health Check Verified",
            description="Zone redundancy health check completed. NAT Gateway instances are fully operational across Availability Zones 1, 2, and 3.",
            component="nat-gw-prod-eastus",
            timestamp="5 hours ago",
            status="RESOLVED",
            resolved_at="4 hours ago"
        ),
        AlertModel(
            id="ALT-2037",
            alert_type="Subnet Connectivity",
            severity="INFO",
            title="AKS Worker Node Subnet Egress Route Synchronized",
            description="Subnet aks-nodes-subnet route table verified with default route 0.0.0.0/0 next-hop mapped to NAT Gateway.",
            component="aks-nodes-subnet",
            timestamp="1 day ago",
            status="RESOLVED",
            resolved_at="1 day ago"
        )
    ]
    db.add_all(alerts)

    db.commit()
