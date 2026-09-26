from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import NetworkHealthResponse
from app.services.demo_azure_service import DemoAzureService
from app.services.network_health_service import NetworkHealthService
from app.models.models import NatGatewayModel, AlertModel

router = APIRouter(tags=["Network Health"])

@router.get("/api/network-health", response_model=NetworkHealthResponse)
def get_network_health(db: Session = Depends(get_db)):
    service = DemoAzureService(db)
    dash = service.get_dashboard_summary()
    active_alerts_db = db.query(AlertModel).filter(AlertModel.status == "ACTIVE").all()
    active_alerts = [{"severity": a.severity} for a in active_alerts_db]
    
    return NetworkHealthService.calculate_health(
        gateway_status=dash["gateway_status"],
        snat_utilization_pct=dash["snat_utilization"],
        active_connections=dash["active_connections"],
        failed_connections=1 if not dash["is_simulation_active"] else 12,
        active_alerts=active_alerts
    )
