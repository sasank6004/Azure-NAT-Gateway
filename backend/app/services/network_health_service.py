from datetime import datetime
from typing import Dict, Any, List

class NetworkHealthService:
    @staticmethod
    def calculate_health(
        gateway_status: str,
        snat_utilization_pct: float,
        active_connections: int,
        failed_connections: int,
        active_alerts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        # 1. Gateway availability score (35% weight)
        if gateway_status.lower() == "healthy":
            gw_score = 100
            gw_status = "Optimal"
        elif gateway_status.lower() == "warning":
            gw_score = 70
            gw_status = "Attention"
        else:
            gw_score = 30
            gw_status = "Critical"

        # 2. SNAT headroom score (25% weight)
        if snat_utilization_pct < 45.0:
            snat_score = 100
            snat_status = "Ample Port Capacity"
        elif snat_utilization_pct < 70.0:
            snat_score = 90
            snat_status = "Healthy Allocation"
        elif snat_utilization_pct < 85.0:
            snat_score = 75
            snat_status = "Elevated Usage"
        elif snat_utilization_pct < 95.0:
            snat_score = 45
            snat_status = "High Exhaustion Risk"
        else:
            snat_score = 15
            snat_status = "Severe Port Depletion"

        # 3. Connection success score (20% weight)
        total_conns = max(1, active_connections + failed_connections)
        success_rate = ((total_conns - failed_connections) / total_conns) * 100
        if success_rate >= 99.0:
            conn_score = 100
            conn_status = f"{success_rate:.1f}% Success Rate"
        elif success_rate >= 95.0:
            conn_score = 85
            conn_status = f"{success_rate:.1f}% Minor Packet Drops"
        else:
            conn_score = 50
            conn_status = f"{success_rate:.1f}% High Failure Rate"

        # 4. Active alert severity penalty score (20% weight)
        alert_score = 100
        for alert in active_alerts:
            sev = alert.get("severity", "INFO").upper()
            if sev == "CRITICAL":
                alert_score -= 25
            elif sev == "HIGH":
                alert_score -= 15
            elif sev == "WARNING":
                alert_score -= 5
        alert_score = max(20, alert_score)
        alert_status = "No Critical Incidents" if alert_score >= 90 else f"{len(active_alerts)} Active Alerts"

        # Weighted calculation
        overall = (
            (gw_score * 0.35) +
            (snat_score * 0.25) +
            (conn_score * 0.20) +
            (alert_score * 0.20)
        )
        overall_score = int(round(overall))

        if overall_score >= 95:
            status_label = "Optimal"
            summary_message = "All Azure NAT Gateway subnets operating with ideal SNAT headroom and deterministic IP egress."
        elif overall_score >= 85:
            status_label = "Healthy"
            summary_message = "Network operations healthy with normal background outbound traffic flows."
        elif overall_score >= 70:
            status_label = "Warning"
            summary_message = "Elevated SNAT utilization or minor alerts detected. Monitoring outbound connection rates."
        elif overall_score >= 50:
            status_label = "Degraded"
            summary_message = "Degraded performance observed. SNAT port exhaustion or connection drops possible."
        else:
            status_label = "Critical"
            summary_message = "Severe outbound degradation. High risk of SNAT port exhaustion and outbound timeouts."

        factors = [
            {
                "name": "Gateway Availability & Fabric Health",
                "score": gw_score,
                "weight_pct": 35,
                "status": gw_status,
                "impact": "Primary NAT translation fabric and zone redundancy check"
            },
            {
                "name": "SNAT Port Headroom & Allocation",
                "score": snat_score,
                "weight_pct": 25,
                "status": snat_status,
                "impact": f"{snat_utilization_pct:.1f}% total capacity utilized across public IPs"
            },
            {
                "name": "Connection Delivery & Drop Rate",
                "score": conn_score,
                "weight_pct": 20,
                "status": conn_status,
                "impact": f"{failed_connections} failed connections observed in current sample"
            },
            {
                "name": "Active Infrastructure Incidents",
                "score": alert_score,
                "weight_pct": 20,
                "status": alert_status,
                "impact": f"{len(active_alerts)} unresolved telemetry alerts"
            }
        ]

        return {
            "overall_score": overall_score,
            "status_label": status_label,
            "calculation_timestamp": datetime.utcnow().isoformat() + "Z",
            "factors": factors,
            "summary_message": summary_message
        }
