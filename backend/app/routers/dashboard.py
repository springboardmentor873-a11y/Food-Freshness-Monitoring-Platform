from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app import models, schemas
from app.core.security import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard & Analytics"])


@router.get("/summary", response_model=schemas.DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    items_query = db.query(models.FoodItem)
    if current_user.role == models.UserRole.consumer:
        items_query = items_query.filter(models.FoodItem.owner_id == current_user.id)
    items = items_query.all()
    item_ids = [i.id for i in items]

    latest_by_item = {}
    if item_ids:
        assessments = (
            db.query(models.FreshnessAssessment)
            .filter(models.FreshnessAssessment.food_item_id.in_(item_ids))
            .order_by(models.FreshnessAssessment.created_at.desc())
            .all()
        )
        for a in assessments:
            latest_by_item.setdefault(a.food_item_id, a)

    fresh_count = sum(
        1 for a in latest_by_item.values()
        if a.freshness_category == models.FreshnessCategory.fresh
    )
    near_spoilage_count = sum(
        1 for a in latest_by_item.values()
        if a.freshness_category == models.FreshnessCategory.near_spoilage
    )
    spoiled_count = sum(
        1 for a in latest_by_item.values()
        if a.freshness_category == models.FreshnessCategory.spoiled
    )
    avg_score = (
        round(sum(a.overall_freshness_score for a in latest_by_item.values()) / len(latest_by_item), 2)
        if latest_by_item else 0.0
    )

    soon_cutoff = datetime.utcnow() + timedelta(days=3)
    expiring_soon = [
        i for i in items
        if i.expiry_date is not None and datetime.utcnow() <= i.expiry_date <= soon_cutoff
    ]

    return schemas.DashboardSummary(
        total_items=len(items),
        fresh_count=fresh_count,
        near_spoilage_count=near_spoilage_count,
        spoiled_count=spoiled_count,
        average_freshness_score=avg_score,
        items_expiring_soon=expiring_soon,
    )
