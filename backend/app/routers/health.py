from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["Health"])

@router.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "azure-nat-gateway-backend",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
