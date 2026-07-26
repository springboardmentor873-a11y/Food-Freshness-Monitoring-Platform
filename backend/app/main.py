from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.core.config import settings
from app.routers import auth, users, inventory, freshness, dashboard

# Create tables on startup (fine for dev/small deployments; use Alembic
# migrations for production schema changes).
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description=(
        "AI-powered Food Freshness Monitoring Platform API. Provides "
        "authentication, food inventory management, image-based freshness "
        "assessment, shelf-life prediction, storage monitoring, and "
        "analytics dashboards."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(inventory.router)
app.include_router(freshness.router)
app.include_router(dashboard.router)


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": settings.app_name}
