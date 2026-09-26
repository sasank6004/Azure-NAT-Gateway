import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.services.azure_service import AzureServiceInterface
from app.services.simulation_service import SimulationService
from app.services.network_health_service import NetworkHealthService
from app.models.models import (
    NatGatewayModel,
    SubnetModel,
    ConnectionModel,
    TrafficMetricModel,
    SnatMetricModel,
    CostMetricModel,
    AlertModel
)

class DemoAzureService(AzureServiceInterface):
    def __init__(self, db: Session):
        self.db = db
        self.simulation = SimulationService()

    def get_dashboard_summary(self) -> Dict[str, Any]:
        sim_status = self.simulation.get_status()
        mult = self.simulation.get_multiplier()

        gateway = self.db.query(NatGatewayModel).first()
        active_conns = int(round((gateway.active_connections if gateway else 1248) * mult))
        
        if sim_status["is_active"]:
            snat_util = sim_status["snat_utilization_target"]
            processed_gb = round((gateway.data_processed_gb if gateway else 284.6) + (mult * 14.5), 1)
        else:
            snat_util = gateway.snat_utilization_pct if gateway else 38.2
            processed_gb = gateway.data_processed_gb if gateway else 284.6

        public_ips = json.loads(gateway.public_ips) if gateway and gateway.public_ips else ["20.45.123.10", "20.45.123.11"]
        
        # Calculate monthly cost: ~730 hrs * $0.045 = $32.85 + $0.045 * GB
        monthly_cost = round(32.85 + (processed_gb * 0.045), 2)

        # Alerts calculation for health score
        active_alerts_db = self.db.query(AlertModel).filter(AlertModel.status == "ACTIVE").all()
        active_alerts = [{"severity": a.severity} for a in active_alerts_db]
        if sim_status["is_active"] and sim_status["load"] == "High":
            active_alerts.append({"severity": "HIGH"})

        failed_conns = 1 if not sim_status["is_active"] else (4 if sim_status["load"] == "Medium" else 18)
        
        health_result = NetworkHealthService.calculate_health(
            gateway_status="Healthy" if snat_util < 90 else "Warning",
            snat_utilization_pct=snat_util,
            active_connections=active_conns,
            failed_connections=failed_conns,
            active_alerts=active_alerts
        )

        return {
            "network_health": health_result["overall_score"],
            "gateway_status": "Healthy" if snat_util < 90 else "Warning",
            "public_ip": public_ips[0],
            "public_ips": public_ips,
            "active_connections": active_conns,
            "snat_utilization": round(snat_util, 1),
            "data_processed_gb": processed_gb,
            "monthly_cost": monthly_cost,
            "region": gateway.region if gateway else "East US",
            "resource_group": gateway.resource_group if gateway else "rg-networking-prod",
            "is_simulation_active": sim_status["is_active"],
            "environment": "DEMO / SIMULATED ENVIRONMENT"
        }

    def get_nat_gateway_details(self) -> Dict[str, Any]:
        sim_status = self.simulation.get_status()
        mult = self.simulation.get_multiplier()
        gw = self.db.query(NatGatewayModel).first()
        subnets = self.db.query(SubnetModel).all()

        public_ips = json.loads(gw.public_ips) if gw and gw.public_ips else ["20.45.123.10", "20.45.123.11"]
        zones = json.loads(gw.zones) if gw and gw.zones else ["1", "2", "3"]

        snat_util = sim_status["snat_utilization_target"] if sim_status["is_active"] else (gw.snat_utilization_pct if gw else 38.2)
        active_conns = int(round((gw.active_connections if gw else 1248) * mult))
        throughput = round((gw.current_throughput_mbps if gw else 184.6) * mult, 1)
        data_gb = round((gw.data_processed_gb if gw else 284.6) + (14.5 * (mult - 1.0)), 1)

        return {
            "id": gw.id if gw else "nat-gw-prod-eastus",
            "name": gw.name if gw else "nat-gw-prod-eastus",
            "status": "Healthy" if snat_util < 90 else "Warning",
            "region": gw.region if gw else "East US",
            "resource_group": gw.resource_group if gw else "rg-networking-prod",
            "subscription_id": gw.subscription_id if gw else "sub-azure-90214-prod",
            "sku": gw.sku if gw else "Standard",
            "zones": zones,
            "idle_timeout_minutes": gw.idle_timeout_minutes if gw else 4,
            "tcp_reset_enabled": gw.tcp_reset_enabled if gw else True,
            "public_ips": public_ips,
            "attached_subnets_count": len(subnets),
            "attached_subnets": [s.name for s in subnets],
            "current_throughput_mbps": throughput,
            "active_connections": active_conns,
            "snat_utilization_pct": round(snat_util, 1),
            "data_processed_gb": data_gb,
            "created_date": gw.created_date if gw else "2025-11-14T08:30:00Z",
            "environment": "DEMO / SIMULATED"
        }

    def get_subnets(self) -> List[Dict[str, Any]]:
        mult = self.simulation.get_multiplier()
        subnets = self.db.query(SubnetModel).all()
        res = []
        for s in subnets:
            res.append({
                "id": s.id,
                "name": s.name,
                "vnet_name": s.vnet_name,
                "cidr": s.cidr,
                "private_ip_range": s.private_ip_range,
                "resources_count": s.resources_count,
                "outbound_ip": s.outbound_ip,
                "active_connections": int(round(s.active_connections * mult)),
                "status": s.status,
                "description": s.description
            })
        return res

    def get_connections(self, status: str = None, protocol: str = None, limit: int = 50) -> Dict[str, Any]:
        mult = self.simulation.get_multiplier()
        query = self.db.query(ConnectionModel)
        if status and status.lower() != "all":
            query = query.filter(ConnectionModel.status.ilike(status))
        if protocol and protocol.lower() != "all":
            query = query.filter(ConnectionModel.protocol.ilike(protocol))
        
        items = query.limit(limit).all()
        
        total_conns = int(round(1248 * mult))
        active_conns = int(round(1190 * mult))
        failed_conns = int(round(1 * mult)) if mult < 2 else int(round(8 * mult))
        conns_per_min = int(round(420 * mult))
        avg_duration = 14.8

        return {
            "total_connections": total_conns,
            "active_connections": active_conns,
            "failed_connections": failed_conns,
            "connections_per_minute": conns_per_min,
            "avg_connection_duration_sec": avg_duration,
            "items": [
                {
                    "id": c.id,
                    "source_ip": c.source_ip,
                    "source_subnet": c.source_subnet,
                    "destination_ip": c.destination_ip,
                    "destination_host": c.destination_host,
                    "protocol": c.protocol,
                    "destination_port": c.destination_port,
                    "snat_port": c.snat_port,
                    "status": c.status,
                    "bytes_transferred": int(round(c.bytes_transferred * mult)),
                    "duration_seconds": c.duration_seconds,
                    "timestamp": c.timestamp
                }
                for c in items
            ]
        }

    def get_traffic_metrics(self, timeframe: str = "24h") -> Dict[str, Any]:
        mult = self.simulation.get_multiplier()
        metrics_db = self.db.query(TrafficMetricModel).all()
        
        points = []
        for m in metrics_db:
            points.append({
                "time": m.time_label,
                "traffic_mbps": round(m.outbound_mbps * mult, 1),
                "requests_per_min": int(round(m.requests_per_min * mult)),
                "connections": int(round(m.active_connections * mult)),
                "data_processed_gb": round(m.data_processed_gb + (5.0 * (mult - 1.0)), 1)
            })

        top_destinations = [
            {"host": "api.stripe.com", "ip": "54.187.205.235", "requests": int(48200 * mult), "category": "Payment Gateway", "percentage": 34.2},
            {"host": "login.microsoftonline.com", "ip": "20.190.159.0", "requests": int(36400 * mult), "category": "Identity & Entra ID", "percentage": 25.8},
            {"host": "blob.core.windows.net", "ip": "52.239.144.18", "requests": int(24100 * mult), "category": "Storage Backups", "percentage": 17.1},
            {"host": "registry.npmjs.org", "ip": "104.16.27.35", "requests": int(18500 * mult), "category": "Package Registry", "percentage": 13.1},
            {"host": "api.github.com", "ip": "140.82.113.4", "requests": int(13800 * mult), "category": "CI/CD & Git Webhooks", "percentage": 9.8},
        ]

        total_gb = round(284.6 + (18.2 * (mult - 1.0)), 1)
        peak_mbps = round(218.5 * mult, 1)

        return {
            "timeframe": timeframe,
            "metrics": points,
            "top_destinations": top_destinations,
            "total_data_processed_gb": total_gb,
            "peak_throughput_mbps": peak_mbps
        }

    def get_snat_metrics(self) -> Dict[str, Any]:
        sim_status = self.simulation.get_status()
        mult = self.simulation.get_multiplier()
        total_ports = 129024  # 64,512 ports per IP * 2 IPs

        if sim_status["is_active"]:
            util_pct = sim_status["snat_utilization_target"]
            used_ports = int(round(total_ports * (util_pct / 100.0)))
            avail_ports = total_ports - used_ports
            rate = round(16.8 * mult, 1)
        else:
            used_ports = 49287
            avail_ports = total_ports - used_ports
            util_pct = round((used_ports / total_ports) * 100.0, 1)
            rate = 16.8

        if util_pct < 50.0:
            risk = "LOW"
        elif util_pct < 75.0:
            risk = "MEDIUM"
        elif util_pct < 90.0:
            risk = "HIGH"
        else:
            risk = "CRITICAL"

        failed_allocations = 0 if risk in ["LOW", "MEDIUM"] else (3 if risk == "HIGH" else 28)

        # Generate history points reflecting current level
        history_db = self.db.query(SnatMetricModel).all()
        history = []
        for h in history_db:
            scaled_used = min(total_ports, int(round(h.used_ports * mult)))
            scaled_avail = total_ports - scaled_used
            scaled_util = round((scaled_used / total_ports) * 100.0, 1)
            history.append({
                "time": h.time_label,
                "used_ports": scaled_used,
                "available_ports": scaled_avail,
                "utilization_pct": scaled_util
            })

        return {
            "total_snat_ports": total_ports,
            "used_ports": used_ports,
            "available_ports": avail_ports,
            "utilization_percentage": util_pct,
            "port_allocation_rate_per_sec": rate,
            "risk_level": risk,
            "failed_allocations_count": failed_allocations,
            "public_ip_count": 2,
            "ports_per_ip": 64512,
            "history": history
        }

    def get_cost_analysis(self) -> Dict[str, Any]:
        mult = self.simulation.get_multiplier()
        costs_db = self.db.query(CostMetricModel).all()
        
        # Baseline ~410 hours so far in month
        gw_hours = 410.0
        gw_rate = 0.045
        gw_subtotal = round(gw_hours * gw_rate, 2) # ~$18.45

        data_gb = round(284.6 + (20.0 * (mult - 1.0)), 1)
        data_rate = 0.045
        data_subtotal = round(data_gb * data_rate, 2) # ~$12.81 + extra

        current_month = round(gw_subtotal + data_subtotal + 11.54, 2) # ~$42.80 baseline
        estimated_monthly = round(current_month * (730.0 / max(1.0, gw_hours)), 2)

        daily_trend = []
        for c in costs_db:
            daily_trend.append({
                "day": c.date_label,
                "gateway_cost": c.gateway_cost,
                "data_cost": round(c.data_cost * mult, 2),
                "total": round(c.gateway_cost + (c.data_cost * mult), 2)
            })

        return {
            "current_month_cost": current_month,
            "estimated_monthly_cost": estimated_monthly,
            "nat_gateway_hours": gw_hours,
            "data_processed_gb": data_gb,
            "data_processing_cost": data_subtotal,
            "gateway_cost": gw_subtotal,
            "currency": "USD",
            "breakdown": {
                "gateway_hours": gw_hours,
                "gateway_rate_per_hour": gw_rate,
                "gateway_subtotal": gw_subtotal,
                "data_processed_gb": data_gb,
                "data_rate_per_gb": data_rate,
                "data_subtotal": data_subtotal,
                "currency": "USD",
                "total": current_month
            },
            "daily_trend": daily_trend,
            "is_simulated": True
        }

    def get_alerts(self, status: str = None, severity: str = None) -> List[Dict[str, Any]]:
        sim_status = self.simulation.get_status()
        query = self.db.query(AlertModel)
        if status and status.lower() != "all":
            query = query.filter(AlertModel.status == status.upper())
        if severity and severity.lower() != "all":
            query = query.filter(AlertModel.severity == severity.upper())

        alerts = query.order_by(AlertModel.id.desc()).all()
        res = [
            {
                "id": a.id,
                "alert_type": a.alert_type,
                "severity": a.severity,
                "title": a.title,
                "description": a.description,
                "component": a.component,
                "timestamp": a.timestamp,
                "status": a.status,
                "resolved_at": a.resolved_at
            }
            for a in alerts
        ]

        # Inject real-time dynamic alert if simulation is active with high load
        if sim_status["is_active"] and sim_status["load"] == "High":
            sim_alert = {
                "id": "SIM-BURST-89",
                "alert_type": "SNAT Port Utilization",
                "severity": "CRITICAL",
                "title": "[SIMULATION] Extreme SNAT Port Load: 89.7% Capacity Reached",
                "description": "Simulation stress workload has consumed 115,734 of 129,024 SNAT ports. Outbound connection queuing detected.",
                "component": "Simulation Runner / Egress NAT",
                "timestamp": "Just now",
                "status": "ACTIVE",
                "resolved_at": None
            }
            if not any(a["id"] == "SIM-BURST-89" for a in res):
                res.insert(0, sim_alert)

        return res

    def resolve_alert(self, alert_id: str, resolved_by: str = "User") -> Dict[str, Any]:
        alert = self.db.query(AlertModel).filter(AlertModel.id == alert_id).first()
        if not alert:
            return {"success": False, "message": f"Alert {alert_id} not found", "alert_id": alert_id}

        alert.status = "RESOLVED"
        alert.resolved_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        self.db.commit()

        return {
            "success": True,
            "message": f"Alert {alert_id} marked as resolved by {resolved_by}",
            "alert_id": alert_id,
            "status": "RESOLVED",
            "resolved_at": alert.resolved_at
        }

    def get_architecture_topology(self) -> Dict[str, Any]:
        return {
            "vnet_name": "vnet-prod-eastus",
            "vnet_cidr": "10.0.0.0/16",
            "nat_gateway_name": "nat-gw-prod-eastus",
            "public_ips": ["20.45.123.10", "20.45.123.11"],
            "nodes": [
                {
                    "id": "node-internet",
                    "label": "Public Internet & SaaS Endpoints",
                    "type": "internet",
                    "status": "Healthy",
                    "details": {
                        "targets": ["api.stripe.com", "login.microsoftonline.com", "api.github.com"],
                        "policy": "Requires whitelisted IP addresses for security firewalls"
                    }
                },
                {
                    "id": "node-pip",
                    "label": "Public IP Addresses (Prefix / Single)",
                    "type": "public_ip",
                    "status": "Healthy",
                    "details": {
                        "ips": ["20.45.123.10", "20.45.123.11"],
                        "total_ports": 129024,
                        "ports_per_ip": 64512,
                        "sku": "Standard IPv4 Static"
                    }
                },
                {
                    "id": "node-nat-gw",
                    "label": "Azure NAT Gateway (nat-gw-prod-eastus)",
                    "type": "nat_gateway",
                    "status": "Healthy",
                    "details": {
                        "sku": "Standard",
                        "zones": ["1", "2", "3"],
                        "idle_timeout": "4 minutes",
                        "tcp_reset": True,
                        "features": "Dynamic SNAT port allocation, 50 Gbps throughput per gateway"
                    }
                },
                {
                    "id": "node-vnet",
                    "label": "Virtual Network (vnet-prod-eastus)",
                    "type": "vnet",
                    "status": "Healthy",
                    "details": {
                        "cidr": "10.0.0.0/16",
                        "region": "East US",
                        "resource_group": "rg-networking-prod"
                    }
                },
                {
                    "id": "node-snet-frontend",
                    "label": "frontend-subnet (10.0.1.0/24)",
                    "type": "subnet",
                    "status": "Healthy",
                    "details": {
                        "resources": 24,
                        "outbound_ip": "20.45.123.10",
                        "workloads": "Nginx Ingress, Next.js Web Containers"
                    }
                },
                {
                    "id": "node-snet-backend",
                    "label": "backend-subnet (10.0.2.0/24)",
                    "type": "subnet",
                    "status": "Healthy",
                    "details": {
                        "resources": 18,
                        "outbound_ip": "20.45.123.10",
                        "workloads": "FastAPI Services, Order Processing, Payment Workers"
                    }
                },
                {
                    "id": "node-snet-database",
                    "label": "database-subnet (10.0.3.0/24)",
                    "type": "subnet",
                    "status": "Healthy",
                    "details": {
                        "resources": 8,
                        "outbound_ip": "20.45.123.10",
                        "workloads": "PostgreSQL Flexible Server, Redis Cache Replication"
                    }
                },
                {
                    "id": "node-snet-aks",
                    "label": "aks-nodes-subnet (10.0.4.0/24)",
                    "type": "subnet",
                    "status": "Healthy",
                    "details": {
                        "resources": 32,
                        "outbound_ip": "20.45.123.11",
                        "workloads": "Kubernetes Worker Nodes, DaemonSets, Telemetry Collectors"
                    }
                }
            ],
            "links": [
                {"source": "node-snet-frontend", "target": "node-nat-gw", "label": "Egress 0.0.0.0/0", "active_flows": 428},
                {"source": "node-snet-backend", "target": "node-nat-gw", "label": "Egress 0.0.0.0/0", "active_flows": 512},
                {"source": "node-snet-database", "target": "node-nat-gw", "label": "Egress 0.0.0.0/0", "active_flows": 308},
                {"source": "node-snet-aks", "target": "node-nat-gw", "label": "Egress 0.0.0.0/0", "active_flows": 620},
                {"source": "node-nat-gw", "target": "node-pip", "label": "SNAT Translation", "active_flows": 1868},
                {"source": "node-pip", "target": "node-internet", "label": "Deterministic Public Outbound", "active_flows": 1868}
            ],
            "data_flow_explanation": [
                "1. Subnet instances (VMs, Pods) initiate outbound TCP/UDP connection toward internet destination (e.g. api.stripe.com:443).",
                "2. Azure SDN fabric directs outbound packets to the attached NAT Gateway rather than default internet egress or basic load balancer.",
                "3. NAT Gateway dynamically assigns an available SNAT port (1024-65535) from its configured Public IP pool (64,512 ports per IP).",
                "4. Packet leaves Azure with the stable public IP (20.45.123.10) as the Source IP and the assigned SNAT port as the Source Port.",
                "5. External service responds to 20.45.123.10:SNAT_PORT. NAT Gateway translates back to the private IP (e.g. 10.0.2.14) and delivers response packet seamlessly."
            ]
        }
