"""Owner-scoped inventory persistence operations."""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.models import InventoryItem


class InventoryRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def create(self, item: InventoryItem) -> InventoryItem:
        self._session.add(item); self._session.flush(); return item

    def get(self, item_id: UUID, user_id: UUID) -> InventoryItem | None:
        return self._session.scalar(select(InventoryItem).where(InventoryItem.id == item_id, InventoryItem.user_id == user_id))

    def list(self, user_id: UUID, search: str | None, category: str | None, page: int, page_size: int, sort_by: str, descending: bool) -> tuple[list[InventoryItem], int]:
        statement = select(InventoryItem).where(InventoryItem.user_id == user_id)
        if search:
            search_pattern = f"%{search}%"
            statement = statement.where(
                InventoryItem.food_name.ilike(search_pattern)
                | InventoryItem.category.ilike(search_pattern)
                | InventoryItem.storage_location.ilike(search_pattern)
            )
        if category:
            statement = statement.where(func.lower(InventoryItem.category) == category.lower())
        total = self._session.scalar(select(func.count()).select_from(statement.subquery())) or 0
        column = getattr(InventoryItem, sort_by)
        statement = statement.order_by(column.desc() if descending else column.asc()).offset((page - 1) * page_size).limit(page_size)
        return list(self._session.scalars(statement)), total


    def delete(self, item: InventoryItem) -> None:
        self._session.delete(item)
