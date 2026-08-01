from fastapi import APIRouter, Depends
from app.security import get_current_user
from app.models import User
from app.database import list_items, list_storage_conditions
from pathlib import Path

router = APIRouter()


def build_alerts(items, conditions):
    alerts = []
    if any(cond.temperature > 8 for cond in conditions):
        alerts.append({"message": "Temperature drift detected in storage.", "level": "warning"})
    if any(cond.humidity > 75 for cond in conditions):
        alerts.append({"message": "Humidity above threshold for fresh products.", "level": "critical"})
    if len(items) > 0 and sum(1 for item in items if item.status.lower() == "spoiled") / len(items) > 0.2:
        alerts.append({"message": "High spoilage rate detected in inventory.", "level": "warning"})
    if not Path("data/freshness_labels.csv").exists():
        alerts.append({"message": "Shelf-life dataset not found. Upload dataset to enable model training.", "level": "info"})
    return alerts


@router.get("/summary")
def dashboard_summary(user: User = Depends(get_current_user)):
    items = list_items()
    conditions = list_storage_conditions()
    total_items = len(items)
    fresh = sum(1 for item in items if item.status and item.status.lower() == "fresh")
    spoiled = sum(1 for item in items if item.status and item.status.lower() == "spoiled")
    categories = {}
    for item in items:
        categories[item.category] = categories.get(item.category, 0) + 1

    return {
        "user": user.username,
        "role": user.role,
        "total_items": total_items,
        "fresh_items": fresh,
        "spoiled_items": spoiled,
        "category_counts": categories,
        "storage_conditions": [cond.dict() for cond in conditions],
        "dataset_present": Path("data/freshness_labels.csv").exists(),
        "image_dataset_present": Path("Freshness44").exists(),
        "image_model_present": Path("data/image_model.joblib").exists(),
        "alerts": build_alerts(items, conditions),
    }
