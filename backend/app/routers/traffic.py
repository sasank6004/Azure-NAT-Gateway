from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import TrafficResponse
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["Traffic"])

@router.get("/api/traffic", response_model=TrafficResponse)
def get_traffic(
    timeframe: str = Query("24h", description="Timeframe: 1h, 6h, 24h, 7d"),
    db: Session = Depends(get_db)
):
    service = DemoAzureService(db)
    return service.get_traffic_metrics(timeframe=timeframe)
