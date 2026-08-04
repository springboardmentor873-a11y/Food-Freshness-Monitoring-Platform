"""Read-only analytics aggregates over user-owned records."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.models import InventoryItem, PredictionHistory


class AnalyticsRepository:
    def __init__(self, session: Session) -> None: self._session = session

    def totals(self, user_id: UUID, since: datetime) -> tuple[int, int, int, int, float, int]:
        from datetime import date, timedelta
        total_foods = self._session.scalar(select(func.count()).select_from(InventoryItem).where(InventoryItem.user_id == user_id)) or 0
        three_days = date.today() + timedelta(days=3)
        near_expiry = self._session.scalar(select(func.count()).select_from(InventoryItem).where(InventoryItem.user_id == user_id, InventoryItem.expiry_date <= three_days)) or 0
        prediction_stats = self._session.execute(select(func.count(), func.count().filter(PredictionHistory.freshness_status == "fresh"), func.count().filter(PredictionHistory.freshness_status == "spoiled"), func.avg(PredictionHistory.confidence)).where(PredictionHistory.user_id == user_id, PredictionHistory.created_at >= since)).one()
        return total_foods, int(prediction_stats[0] or 0), int(prediction_stats[1] or 0), int(prediction_stats[2] or 0), float(prediction_stats[3] or 0), int(near_expiry)


    def categories(self, user_id: UUID) -> list[tuple[str, int]]:
        return [(str(category), int(count)) for category, count in self._session.execute(select(InventoryItem.category, func.count()).where(InventoryItem.user_id == user_id).group_by(InventoryItem.category).order_by(func.count().desc()))]

    def trends(self, user_id: UUID, since: datetime) -> list[tuple[object, int, int]]:
        day = func.date(PredictionHistory.created_at)
        rows = self._session.execute(select(day, func.count().filter(PredictionHistory.freshness_status == "fresh"), func.count().filter(PredictionHistory.freshness_status == "spoiled")).where(PredictionHistory.user_id == user_id, PredictionHistory.created_at >= since).group_by(day).order_by(day))
        return [(value, int(fresh), int(spoiled)) for value, fresh, spoiled in rows]

    def recent(self, user_id: UUID, limit: int = 10):
        return list(self._session.scalars(select(PredictionHistory).where(PredictionHistory.user_id == user_id).order_by(PredictionHistory.created_at.desc()).limit(limit)))
