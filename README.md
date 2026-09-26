# Azure NAT Gateway for Predictable Outbound Connectivity
### Enterprise Cloud Networking & SNAT Monitoring Control Center

A production-style full-stack cloud network operations platform demonstrating how **Azure Virtual Network NAT (NAT Gateway)** delivers predictable, secure, and scalable outbound connectivity for Azure workloads.

---

## 🌟 Project Overview

In enterprise cloud deployments, resources inside private subnets frequently require outbound access to external SaaS platforms, third-party payment gateways (e.g. Stripe), container registries, and partner APIs.

Without a dedicated NAT Gateway, workloads rely on default outbound access or basic load balancer rules, resulting in:
- **Random, non-deterministic public IP addresses** that break external firewall IP whitelisting.
- **SNAT port exhaustion** due to rigid, static port allocations per virtual machine.
- **Security vulnerabilities** associated with assigning instance-level public IPs directly to internal servers.

This platform provides real-time visibility into:
1. **Stable Outbound Public IPs:** Guaranteed static public IP addresses (`20.45.123.10`, `20.45.123.11`) across attached subnets.
2. **SNAT Port Management:** Continuous tracking of port allocation rates and proactive detection of port exhaustion risks against the 129,024 capacity.
3. **Subnet-Level Egress:** Subnet association monitoring (`frontend-subnet`, `backend-subnet`, `database-subnet`, `aks-nodes-subnet`).
4. **Traffic & Throughput Telemetry:** 24-hour analytics for outbound bandwidth (Mbps), requests per minute (RPM), and top destination endpoints.
5. **Cost Optimization & Breakdown:** Hourly gateway uptime tracking ($0.045/hr) and data processing volume ($0.045/GB).
6. **Network Health Score:** Algorithmic composite score calculating fabric availability, connection drops, and active incidents.
7. **Interactive Traffic Simulator:** Real-time stress testing simulating Low, Medium, and High egress loads with automatic alert triggers.

---

## 🏗️ System Architecture

```
                                  [ PUBLIC INTERNET ]
               (api.stripe.com, login.microsoftonline.com, api.github.com)
                                           ▲
                                           │ Deterministic Outbound
                                           ▼
                       [ STATIC PUBLIC IP POOL (Standard SKU) ]
                         20.45.123.10  •  20.45.123.11
                            (64,512 SNAT Ports / IP)
                                           ▲
                                           │ Dynamic 4-Tuple Allocation
                                           ▼
                       [ AZURE NAT GATEWAY (Standard SKU) ]
                       Resource ID: nat-gw-prod-eastus
                       Zones: 1, 2, 3 (Zone-Redundant)
                       Throughput: Up to 50 Gbps Fabric
                                           ▲
                                           │ Subnet Next-Hop Egress (0.0.0.0/0)
                                           ▼
                      [ VIRTUAL NETWORK: vnet-prod-eastus ]
                                  (10.0.0.0/16)
                                           ▲
         ┌───────────────────┬─────────────┴───────┬───────────────────┐
         │                   │                     │                   │
         ▼                   ▼                     ▼                   ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│  frontend-subnet  │ │  backend-subnet   │ │  database-subnet  │ │ aks-nodes-subnet  │
│    10.0.1.0/24    │ │    10.0.2.0/24    │ │    10.0.3.0/24    │ │    10.0.4.0/24    │
│    24 Web Pods    │ │  18 API Services  │ │ 8 DB Replicas     │ │ 32 AKS Nodes      │
└───────────────────┘ └───────────────────┘ └───────────────────┘ └───────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide React, Vite |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Uvicorn |
| **Database** | SQLite (Default for zero-setup demo), structured for PostgreSQL migration |
| **Architecture** | RESTful APIs, Pluggable `AzureServiceInterface`, Centralized API Service |

---

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── app/
│   │   ├── models/            # SQLAlchemy ORM models
│   │   │   └── models.py
│   │   ├── schemas/           # Pydantic validation schemas
│   │   │   └── schemas.py
│   │   ├── routers/           # FastAPI modular endpoints
│   │   │   ├── health.py
│   │   │   ├── dashboard.py
│   │   │   ├── nat_gateway.py
│   │   │   ├── subnets.py
│   │   │   ├── connections.py
│   │   │   ├── traffic.py
│   │   │   ├── snat.py
│   │   │   ├── cost.py
│   │   │   ├── alerts.py
│   │   │   ├── network_health.py
│   │   │   ├── simulation.py
│   │   │   └── architecture.py
│   │   ├── services/          # Business logic & Azure abstractions
│   │   │   ├── azure_service.py
│   │   │   ├── demo_azure_service.py
│   │   │   ├── network_health_service.py
│   │   │   └── simulation_service.py
│   │   ├── utils/             # Seed data & helpers
│   │   │   └── seed_data.py
│   │   ├── database.py        # SQLAlchemy engine & session maker
│   │   └── main.py            # FastAPI entrypoint, CORS & lifespan
│   ├── requirements.txt
│   └── run.py                 # Backend launcher
├── src/
│   ├── components/
│   │   ├── common/            # KpiCard, StatusBadge, Toast, ErrorBanner
│   │   ├── layout/            # Navbar, Sidebar
│   │   ├── modals/            # SimulationModal, SearchModal, NodeDetailModal
│   │   └── topology/          # Interactive NetworkTopology diagram
│   ├── pages/                 # 10 Application pages
│   │   ├── DashboardPage.tsx
│   │   ├── NatGatewayPage.tsx
│   │   ├── SubnetsPage.tsx
│   │   ├── ConnectionsPage.tsx
│   │   ├── TrafficPage.tsx
│   │   ├── SnatPage.tsx
│   │   ├── CostPage.tsx
│   │   ├── AlertsPage.tsx
│   │   ├── ArchitecturePage.tsx
│   │   └── DocumentationPage.tsx
│   ├── services/
│   │   ├── api.ts             # Centralized API service with resilience fallback
│   │   └── fallbackData.ts    # Standalone mock telemetry
│   ├── types/
│   │   └── index.ts           # Unified TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── run_backend.bat
├── run_backend.ps1
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### 1. Backend Setup (FastAPI & SQLite)

From the project root:

```bash
# Create virtual environment (optional)
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the backend server
python backend/run.py
```

Or using Uvicorn directly:
```bash
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

The backend starts at `http://localhost:8000`.
- Interactive Swagger API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

### 2. Frontend Setup (React + Vite)

From the project root:

```bash
# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

Open `http://localhost:5173` (or the configured preview port) in your browser.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and uptime |
| `GET` | `/api/dashboard` | Main KPI summary (Health, SNAT, Active Conns, Cost) |
| `GET` | `/api/nat-gateway` | Gateway details, SKU, zones, timeouts, and public IPs |
| `GET` | `/api/subnets` | Subnet CIDRs, attached resources, and IP allocations |
| `GET` | `/api/connections` | Active sessions with source, destination, and SNAT port |
| `GET` | `/api/traffic` | Outbound throughput, RPM, and top SaaS destinations |
| `GET` | `/api/snat` | Total ports, used ports, available ports, and exhaustion risk |
| `GET` | `/api/cost` | Month-to-date and forecasted hourly and data processing spend |
| `GET` | `/api/alerts` | Active and historical incident alerts with filters |
| `POST` | `/api/alerts/{id}/resolve` | Mark an operational alert as resolved |
| `GET` | `/api/network-health` | Algorithmic health score (0-100) with factor breakdowns |
| `GET` | `/api/simulation/status` | Current load simulation state and remaining timer |
| `POST` | `/api/simulation/start` | Start traffic simulation (`load`: Low/Medium/High, `duration`) |
| `POST` | `/api/simulation/stop` | Stop traffic simulation and restore production baseline |
| `GET` | `/api/architecture` | Network topology nodes, links, and egress workflow |

---

## 🧪 Simulation Mode

To test how Azure NAT Gateway responds under heavy load:
1. Click **"Run Network Simulation"** in the top navigation bar or Dashboard.
2. Select traffic load intensity:
   - **Low Traffic Ramp:** 48% SNAT utilization (~1,850 connections).
   - **Medium Burst Load:** 72% SNAT utilization (~3,980 connections).
   - **High Stress Spike:** 90% SNAT utilization (~8,450 connections) - triggers exhaustion alerts.
3. Choose test duration (30 seconds, 60 seconds, or 5 minutes).
4. Watch charts update in real-time with responsive traffic changes.
5. All simulation metrics are clearly labeled with `DEMO / SIMULATED DATA` tags.

---

## 🔌 Future Live Azure Telemetry Integration

The backend is built around the `AzureServiceInterface` abstraction:

- `DemoAzureService` (active by default): Serves local database and simulation metrics.
- `RealAzureService` (production ready): Can be implemented using the `@azure/arm-network` and `azure-mgmt-monitor` SDKs to pull live metrics directly from your Azure subscription.

To configure real Azure credentials in `.env`:
```env
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-service-principal-id
AZURE_CLIENT_SECRET=your-service-principal-secret
AZURE_SUBSCRIPTION_ID=your-subscription-id
AZURE_RESOURCE_GROUP=rg-networking-prod
AZURE_NAT_GATEWAY_NAME=nat-gw-prod-eastus
USE_AZURE_LIVE=false
```

---

## 🛡️ License

This project is licensed under the MIT License.
