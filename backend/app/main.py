import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.utils.seed_data import seed_database
from app.routers import (
    health,
    dashboard,
    nat_gateway,
    subnets,
    connections,
    traffic,
    snat,
    cost,
    alerts,
    network_health,
    simulation,
    architecture
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    # Seed initial demo data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Azure NAT Gateway for Predictable Outbound Connectivity API",
    description="Enterprise Cloud Network Operations REST API for monitoring, SNAT allocation, subnet management, and live traffic simulation.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
cors_origins_env = os.getenv("CORS_ALLOWED_ORIGINS", "*")
if cors_origins_env == "*":
    origins = ["*"]
else:
    origins = [orig.strip() for orig in cors_origins_env.split(",") if orig.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True if origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router)
app.include_router(dashboard.router)
app.include_router(nat_gateway.router)
app.include_router(subnets.router)
app.include_router(connections.router)
app.include_router(traffic.router)
app.include_router(snat.router)
app.include_router(cost.router)
app.include_router(alerts.router)
app.include_router(network_health.router)
app.include_router(simulation.router)
app.include_router(architecture.router)

@app.get("/")
def read_root():
    return {
        "service": "Azure NAT Gateway Operations API",
        "status": "Operational",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": [
            "/api/health",
            "/api/dashboard",
            "/api/nat-gateway",
            "/api/subnets",
            "/api/connections",
            "/api/traffic",
            "/api/snat",
            "/api/cost",
            "/api/alerts",
            "/api/network-health",
            "/api/simulation/status",
            "/api/simulation/start",
            "/api/simulation/stop",
            "/api/architecture"
        ]
    }
