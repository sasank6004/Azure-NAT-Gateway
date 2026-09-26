import time
from datetime import datetime
from typing import Dict, Any, Optional

class SimulationService:
    _instance: Optional['SimulationService'] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SimulationService, cls).__new__(cls)
            cls._instance.is_active = False
            cls._instance.load = "Medium"
            cls._instance.duration_seconds = 60
            cls._instance.started_at = 0.0
            cls._instance.simulated_alerts = []
        return cls._instance

    def start_simulation(self, load: str, duration_seconds: int) -> Dict[str, Any]:
        self.is_active = True
        self.load = load.capitalize()
        self.duration_seconds = duration_seconds
        self.started_at = time.time()

        if self.load == "Low":
            target_snat = 48.0
            conns = 1850
            msg = "Low load simulation running: Normal background traffic ramp (48% SNAT)."
        elif self.load == "Medium":
            target_snat = 72.4
            conns = 3980
            msg = "Medium load simulation running: Microservices peak burst (72.4% SNAT)."
        else: # High
            target_snat = 89.7
            conns = 8450
            msg = "High load stress test running: Extreme batch egress load (89.7% SNAT - Exhaustion Warning)!"

        return {
            "is_active": True,
            "load": self.load,
            "duration_seconds": self.duration_seconds,
            "remaining_seconds": self.duration_seconds,
            "snat_utilization_target": target_snat,
            "active_connections": conns,
            "message": msg
        }

    def stop_simulation(self) -> Dict[str, Any]:
        self.is_active = False
        self.started_at = 0.0
        return {
            "is_active": False,
            "load": "Off",
            "duration_seconds": 0,
            "remaining_seconds": 0,
            "snat_utilization_target": 38.2,
            "active_connections": 1248,
            "message": "Simulation stopped. Baseline production metrics restored."
        }

    def get_status(self) -> Dict[str, Any]:
        if not self.is_active:
            return {
                "is_active": False,
                "load": "Off",
                "duration_seconds": 0,
                "remaining_seconds": 0,
                "snat_utilization_target": 38.2,
                "active_connections": 1248,
                "message": "Simulation idle. Displaying baseline telemetry."
            }

        elapsed = time.time() - self.started_at
        remaining = max(0, int(self.duration_seconds - elapsed))

        if remaining == 0:
            self.stop_simulation()
            return {
                "is_active": False,
                "load": "Off",
                "duration_seconds": 0,
                "remaining_seconds": 0,
                "snat_utilization_target": 38.2,
                "active_connections": 1248,
                "message": "Simulation completed duration. Reverted to baseline."
            }

        if self.load == "Low":
            target_snat = 48.0
            conns = 1850
        elif self.load == "Medium":
            target_snat = 72.4
            conns = 3980
        else:
            target_snat = 89.7
            conns = 8450

        return {
            "is_active": True,
            "load": self.load,
            "duration_seconds": self.duration_seconds,
            "remaining_seconds": remaining,
            "snat_utilization_target": target_snat,
            "active_connections": conns,
            "message": f"Simulating {self.load} outbound load. {remaining}s remaining."
        }

    def get_multiplier(self) -> float:
        if not self.is_active:
            return 1.0
        if self.load == "Low":
            return 1.3
        elif self.load == "Medium":
            return 2.2
        else:
            return 3.9
