from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import SnatResponse
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["SNAT"])

@router.get("/api/snat", response_model=SnatResponse)
def get_snat(db: Session = Depends(get_db)):
    service = DemoAzureService(db)
    return service.get_snat_metrics()
