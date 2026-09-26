from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import DashboardResponse
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["Dashboard"])

@router.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    service = DemoAzureService(db)
    return service.get_dashboard_summary()
