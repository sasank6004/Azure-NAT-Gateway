from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import CostResponse
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["Cost"])

@router.get("/api/cost", response_model=CostResponse)
def get_cost(db: Session = Depends(get_db)):
    service = DemoAzureService(db)
    return service.get_cost_analysis()
