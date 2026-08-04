"""Analytics service built from real PostgreSQL aggregates."""

from datetime import datetime, timedelta, timezone, date

from sqlalchemy.orm import Session

from app.database.models import User
from app.repositories.analytics import AnalyticsRepository
from app.schemas.analytics import (
    ActivityPoint,
    AnalyticsOverview,
    CategoryPoint,
    TrendPoint,
)


class AnalyticsService:
    def __init__(self, session: Session):
        self._repository = AnalyticsRepository(session)

    def _format_date(self, value):
        """
        Safely convert repository date values to ISO strings.

        Supports:
        - datetime
        - date
        - string
        - None
        """

        if value is None:
            return ""

        if isinstance(value, datetime):
            return value.date().isoformat()

        if isinstance(value, date):
            return value.isoformat()

        if isinstance(value, str):
            return value

        return str(value)

    def overview(self, user: User, days: int) -> AnalyticsOverview:

        since = datetime.now(timezone.utc) - timedelta(days=days)

        (
            foods,
            predictions,
            fresh,
            spoiled,
            average_confidence,
            near_expiry,
        ) = self._repository.totals(user.id, since)

        category_distribution = [
            CategoryPoint(
                category=category,
                count=count,
            )
            for category, count in self._repository.categories(user.id)
        ]

        prediction_trends = [
            TrendPoint(
                date=self._format_date(value),
                fresh=fresh_count,
                spoiled=spoiled_count,
            )
            for value, fresh_count, spoiled_count
            in self._repository.trends(user.id, since)
        ]

        recent_activity = [
            ActivityPoint.model_validate(record)
            for record in self._repository.recent(user.id)
        ]

        waste_prevented = round(fresh * 0.45, 1)

        return AnalyticsOverview(
            total_foods=foods,
            total_predictions=predictions,
            fresh_percentage=round(fresh / predictions * 100, 2)
            if predictions
            else 0,
            spoiled_percentage=round(spoiled / predictions * 100, 2)
            if predictions
            else 0,
            average_confidence=round(average_confidence * 100, 2),
            near_expiry_count=near_expiry,
            waste_prevented_kg=waste_prevented,
            category_distribution=category_distribution,
            prediction_trends=prediction_trends,
            recent_activity=recent_activity,
        )