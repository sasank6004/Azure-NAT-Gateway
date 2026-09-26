from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import ConnectionListResponse
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["Connections"])

@router.get("/api/connections", response_model=ConnectionListResponse)
def get_connections(
    status: Optional[str] = Query(None, description="Filter by status: Established, Closed, Failed, Time_Wait, or all"),
    protocol: Optional[str] = Query(None, description="Filter by protocol: TCP, UDP, or all"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    service = DemoAzureService(db)
    return service.get_connections(status=status, protocol=protocol, limit=limit)
