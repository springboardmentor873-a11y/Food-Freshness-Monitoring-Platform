# Food Freshness Monitoring Platform

An AI-powered platform that uses image analysis, environmental conditions,
and storage information to estimate food freshness, predict remaining
shelf life, detect spoilage indicators, and generate storage
recommendations — built for consumers, retailers, restaurants,
warehouses, and food manufacturers to reduce food waste.

This repository implements Milestones 1–2 of the project spec
(`AI_Food Freshness Monitoring Platform.pdf`): authentication and
role-based access, food inventory management, an image-based freshness
assessment engine, shelf-life prediction, storage condition scoring, a
weighted freshness scoring model, a recommendation engine, and analytics
dashboards. It's a working foundation intended to be extended with a
trained CNN model, IoT sensor ingestion, and further analytics as the
project continues through Milestones 3–4.

## Architecture

```
food-freshness-monitoring-platform/
├── backend/                 FastAPI service
│   ├── app/
│   │   ├── main.py          App entrypoint, router registration
│   │   ├── models.py        SQLAlchemy models (User, FoodItem, FreshnessAssessment)
│   │   ├── schemas.py       Pydantic request/response schemas
│   │   ├── database.py      DB engine/session setup
│   │   ├── core/
│   │   │   ├── config.py    Environment-driven settings
│   │   │   └── security.py  JWT auth, password hashing, RBAC dependency
│   │   ├── routers/         auth, users, inventory, freshness, dashboard
│   │   └── services/        image_analysis, storage_scoring, shelf_life,
│   │                        scoring, recommendations
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 React (Vite) single-page app
│   └── src/
│       ├── pages/            Login, Register, Dashboard, Inventory, ItemDetail
│       ├── components/       Topbar, FreshnessStamp
│       ├── AuthContext.jsx   Auth state + token handling
│       └── api.js            Axios client
├── docker-compose.yml         backend + frontend + PostgreSQL
└── AI_Food Freshness Monitoring Platform.pdf   Original project spec
```

## How the freshness score is computed

Following the spec's weighted scoring model:

```
Freshness Score = 0.40 × Visual Condition Analysis
                 + 0.25 × Storage Conditions
                 + 0.20 × Shelf-Life Prediction
                 + 0.15 × Product Age
```

- **Visual Condition Analysis** (`services/image_analysis.py`): OpenCV-based
  color vividness, texture (Laplacian variance), and HSV-threshold
  detectors for mold and bruising/damage.
- **Storage Conditions** (`services/storage_scoring.py`): compares the
  item's recorded temperature/humidity against category-specific
  reference ranges.
- **Shelf-Life Prediction** (`services/shelf_life.py`): estimates
  remaining shelf life and spoilage probability from category baseline
  life, storage quality, and visual condition.
- **Recommendations** (`services/recommendations.py`): rule-based
  storage/consumption/rotation guidance derived from the above.

These are transparent, rule-based baselines by design, so they run
without GPUs or pretrained weights and are easy to audit. Swapping in a
trained CNN (image analysis) or a scikit-learn regression model
(shelf-life) is a drop-in replacement — see the "Next steps" section.

## Running locally (no Docker)

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit SECRET_KEY at minimum
uvicorn app.main:app --reload
```

The API is served at `http://localhost:8000`, with interactive docs at
`http://localhost:8000/docs`. By default it uses a local SQLite file, so
no database setup is required to get started.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app is served at `http://localhost:5173` and proxies `/api` requests
to `http://localhost:8000` (configurable via `VITE_API_PROXY_TARGET`).

## Running with Docker Compose

```bash
docker compose up --build
```

This starts PostgreSQL, the backend on `:8000`, and the frontend
(built and served via nginx) on `:3000`.

## API overview

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Users | `GET /api/users/me`, `GET /api/users` (admin) |
| Inventory | `GET/POST /api/inventory`, `GET/PATCH/DELETE /api/inventory/{id}` |
| Freshness | `POST /api/freshness/assess/{item_id}` (image upload), `GET /api/freshness/item/{item_id}` |
| Dashboard | `GET /api/dashboard/summary` |

All endpoints except `/api/auth/*` and `/api/health` require a
`Authorization: Bearer <token>` header obtained from `/api/auth/login`.

## Roles

`consumer`, `retail_manager`, `warehouse_operator`,
`food_quality_inspector`, `administrator` — enforced via the
`require_roles(...)` dependency in `app/core/security.py`. Consumers see
only their own inventory; staff roles see the full inventory.

## Tech stack

Matches the spec: **FastAPI** + **SQLAlchemy** (PostgreSQL in
production, SQLite for local dev) on the backend; **React** (Vite) on
the frontend; **OpenCV**/**NumPy** for image analysis; **JWT** for
auth; **Docker Compose** for deployment.

## Next steps (Milestones 3–4)

- Replace the heuristic image analysis with a trained CNN/YOLO model
  fine-tuned on the recommended datasets (Fruits/Vegetables Freshness
  Datasets, Kaggle Food Freshness Dataset, Food-101).
- Replace the rule-based shelf-life model with a scikit-learn regression
  model trained on labeled storage/outcome data.
- Add IoT sensor ingestion (MQTT) for live temperature/humidity feeds.
- Add PDF/Excel report export and a notification/alert system.
- Add automated tests and a CI pipeline (GitHub Actions).
- Add role-specific dashboard views (retail, warehouse, admin) beyond
  the current consumer-oriented dashboard.
