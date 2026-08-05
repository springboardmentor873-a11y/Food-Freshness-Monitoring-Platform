from app.routers.auth import router as auth_router
from app.routers.admin import router as admin_router
from app.routers.prediction import router as prediction_router
from app.routers.inventory import router as inventory_router
from app.routers.notifications import router as notification_router
from app.routers.reports import router as report_router
from app.routers.profile import router as profile_router
from app.routers.analytics import router as analytics_router

__all__ = [
    "auth_router",
    "admin_router",
    "prediction_router",
    "inventory_router",
    "notification_router",
    "report_router",
    "profile_router",
    "analytics_router",
]
