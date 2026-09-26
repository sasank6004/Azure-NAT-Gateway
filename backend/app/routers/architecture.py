from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import ArchitectureResponse
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["Architecture"])

@router.get("/api/architecture", response_model=ArchitectureResponse)
def get_architecture(db: Session = Depends(get_db)):
    service = DemoAzureService(db)
    return service.get_architecture_topology()
