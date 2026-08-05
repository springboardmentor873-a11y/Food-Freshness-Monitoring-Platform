import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.auth_service import seed_default_admin
from app.utils.model_loader import model_manager
from app.middleware.active_user_middleware import ActiveUserTrackingMiddleware

from app.routers import (
    auth_router,
    admin_router,
    prediction_router,
    inventory_router,
    notification_router,
    report_router,
    profile_router,
    analytics_router,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("food_freshness_app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Food Freshness Monitoring Database...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        logger.info("Checking default administrator seeding...")
        seed_default_admin(db)
    finally:
        db.close()

    logger.info("Loading EfficientNetB0 AI Model into memory...")
    try:
        model_manager.load_model()
    except Exception as e:
        logger.error(f"Failed to load AI model on startup: {e}")

    logger.info("FastAPI Application Startup Complete.")
    yield
    logger.info("Shutting down FastAPI Application.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-ready FastAPI backend for AI Powered Food Freshness Detection & Monitoring Platform.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(ActiveUserTrackingMiddleware)

# Mount uploaded media static directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Mount Routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(prediction_router)
app.include_router(inventory_router)
app.include_router(notification_router)
app.include_router(report_router)
app.include_router(profile_router)
app.include_router(analytics_router)

@app.get("/", tags=["Health Check"])
@app.get("/api", tags=["Health Check"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "aiModel": "EfficientNetB0 (Keras)",
        "version": "1.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
