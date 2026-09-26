from abc import ABC, abstractmethod
from typing import Dict, Any, List

class AzureServiceInterface(ABC):
    """
    Abstract Base Class for Azure NAT Gateway services.
    Enables swapping between DemoAzureService and RealAzureService (Azure REST / SDK)
    without rewriting application controllers or frontend APIs.
    """

    @abstractmethod
    def get_dashboard_summary(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_nat_gateway_details(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_subnets(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_connections(self, status: str = None, protocol: str = None, limit: int = 50) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_traffic_metrics(self, timeframe: str = "24h") -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_snat_metrics(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_cost_analysis(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_alerts(self, status: str = None, severity: str = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def resolve_alert(self, alert_id: str, resolved_by: str = "User") -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_architecture_topology(self) -> Dict[str, Any]:
        pass
