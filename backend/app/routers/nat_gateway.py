from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.schemas import NatGatewayResponse
from app.services.demo_azure_service import DemoAzureService

router = APIRouter(tags=["NAT Gateway"])

@router.get("/api/nat-gateway", response_model=NatGatewayResponse)
def get_nat_gateway(db: Session = Depends(get_db)):
    service = DemoAzureService(db)
    return service.get_nat_gateway_details()
