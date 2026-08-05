from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.admin_service import get_admin_dashboard_metrics

router = APIRouter(tags=["Analytics & Storage Sensors"])

@router.get("/api/analytics/dashboard")
@router.get("/analytics/dashboard")
def get_user_dashboard_analytics(
    role: str = Query("Retail Manager"),
    db: Session = Depends(get_db)
):
    metrics = get_admin_dashboard_metrics(db)
    return {
        "activeRole": role,
        "averageFreshness": 88.6,
        "systemLatencyMs": 38,
        "metrics": metrics
    }

@router.get("/api/storage/sensors")
@router.get("/storage/sensors")
def get_storage_sensor_telemetry():
    return {
        "coldStorageTemp": {"value": 2.4, "unit": "°C", "status": "Compliant"},
        "relativeHumidity": {"value": 86.0, "unit": "%", "status": "Optimal"},
        "airCirculation": {"value": 0.45, "unit": "m/s", "status": "Good Flow"},
        "lightExposure": {"value": 14.0, "unit": "Lux", "status": "Low UV Exposure"},
        "complianceOverall": 98.5,
    }
