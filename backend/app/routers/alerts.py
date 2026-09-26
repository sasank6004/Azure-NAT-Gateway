from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import AlertItem, AlertResolveRequest
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["Alerts"])

@router.get("/api/alerts", response_model=List[AlertItem])
def get_alerts(
    status: Optional[str] = Query(None, description="Filter by status: ACTIVE, RESOLVED, or all"),
    severity: Optional[str] = Query(None, description="Filter by severity: INFO, WARNING, HIGH, CRITICAL, or all"),
    db: Session = Depends(get_db)
):
    service = DemoAzureService(db)
    return service.get_alerts(status=status, severity=severity)

@router.post("/api/alerts/{alert_id}/resolve")
def resolve_alert(
    alert_id: str = Path(..., description="Alert ID to resolve"),
    payload: Optional[AlertResolveRequest] = None,
    db: Session = Depends(get_db)
):
    resolved_by = payload.resolved_by if payload else "User"
    service = DemoAzureService(db)
    return service.resolve_alert(alert_id=alert_id, resolved_by=resolved_by)
