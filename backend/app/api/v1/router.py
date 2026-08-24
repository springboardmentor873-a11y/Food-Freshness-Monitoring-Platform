"""Central router composition for version 1 of the public API."""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.inventory import router as inventory_router
from app.api.v1.history import router as history_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.reports import router as reports_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.predictions import router as predictions_router
from app.api.v1.admin import router as admin_router
from app.api.v1.system import router as system_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(inventory_router)
api_router.include_router(history_router)
api_router.include_router(analytics_router)
api_router.include_router(reports_router)
api_router.include_router(notifications_router)
api_router.include_router(predictions_router)
api_router.include_router(admin_router)
api_router.include_router(system_router)
