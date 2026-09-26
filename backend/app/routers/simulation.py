from fastapi import APIRouter
from app.schemas.schemas import SimulationRequest, SimulationStatusResponse
from app.services.simulation_service import SimulationService

router = APIRouter(tags=["Simulation"])

@router.get("/api/simulation/status", response_model=SimulationStatusResponse)
def get_simulation_status():
    service = SimulationService()
    return service.get_status()

@router.post("/api/simulation/start", response_model=SimulationStatusResponse)
def start_simulation(payload: SimulationRequest):
    service = SimulationService()
    return service.start_simulation(load=payload.load, duration_seconds=payload.duration_seconds)

@router.post("/api/simulation/stop", response_model=SimulationStatusResponse)
def stop_simulation():
    service = SimulationService()
    return service.stop_simulation()
