"""Database access for user-owned prediction history."""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.models import PredictionHistory


class PredictionHistoryRepository:
    def __init__(self, session: Session) -> None: self._session = session

    def create(self, record: PredictionHistory) -> PredictionHistory:
        self._session.add(record); self._session.flush(); return record

    def list(self, user_id: UUID, search: str | None, freshness_status: str | None, page: int, page_size: int) -> tuple[list[PredictionHistory], int]:
        statement = select(PredictionHistory).where(PredictionHistory.user_id == user_id)
        if search: statement = statement.where(PredictionHistory.prediction.ilike(f"%{search}%"))
        if freshness_status: statement = statement.where(PredictionHistory.freshness_status == freshness_status)
        total = self._session.scalar(select(func.count()).select_from(statement.subquery())) or 0
        statement = statement.order_by(PredictionHistory.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
        return list(self._session.scalars(statement)), total

    def get(self, history_id: UUID, user_id: UUID) -> PredictionHistory | None:
        return self._session.scalar(select(PredictionHistory).where(PredictionHistory.id == history_id, PredictionHistory.user_id == user_id))

    def delete(self, record: PredictionHistory) -> None: self._session.delete(record)
