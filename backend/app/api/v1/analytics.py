"""Authenticated analytics API backed by PostgreSQL aggregates."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database.models import User
from app.database.postgres import get_db
from app.schemas.analytics import AnalyticsOverview
from app.services.analytics import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview", response_model=AnalyticsOverview)
def overview(user: Annotated[User, Depends(get_current_active_user)], db: Annotated[Session, Depends(get_db)], days: int = Query(30, ge=1, le=365)) -> AnalyticsOverview:
    return AnalyticsService(db).overview(user, days)
