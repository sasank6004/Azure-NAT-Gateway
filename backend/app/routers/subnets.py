from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import SubnetResponse
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["Subnets"])

@router.get("/api/subnets", response_model=List[SubnetResponse])
def get_subnets(db: Session = Depends(get_db)):
    service = DemoAzureService(db)
    return service.get_subnets()
