"""Service logic for administration operations."""

from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.models import InventoryItem, PredictionHistory, User
from app.repositories.users import UserRepository
from app.schemas.admin import AdminStatsResponse, AdminUsersPage, UserRoleUpdate


class AdminService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._users_repo = UserRepository(session)

    def list_users(
        self,
        search: str | None = None,
        role: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> AdminUsersPage:
        items, total = self._users_repo.list_all(
            search=search, role=role, page=page, page_size=page_size
        )
        return AdminUsersPage(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
        )

    def update_user_role(self, user_id: UUID, payload: UserRoleUpdate) -> User:
        user = self._users_repo.get_by_id(user_id)
        if user is None:
            raise ValueError("User not found")
        kwargs: dict[str, object] = {"role": payload.role}
        if payload.is_active is not None:
            kwargs["is_active"] = payload.is_active
        updated = self._users_repo.update(user, **kwargs)
        self._session.commit()
        return updated

    def get_admin_stats(self) -> AdminStatsResponse:
        total_users = self._session.scalar(select(func.count(User.id))) or 0
        active_users = (
            self._session.scalar(
                select(func.count(User.id)).where(User.is_active.is_(True))
            )
            or 0
        )
        admin_users = (
            self._session.scalar(
                select(func.count(User.id)).where(
                    func.lower(User.role) == "admin"
                )
            )
            or 0
        )
        total_predictions = (
            self._session.scalar(select(func.count(PredictionHistory.id))) or 0
        )
        total_inventory_items = (
            self._session.scalar(select(func.count(InventoryItem.id))) or 0
        )

        return AdminStatsResponse(
            total_users=total_users,
            active_users=active_users,
            admin_users=admin_users,
            total_predictions=total_predictions,
            total_inventory_items=total_inventory_items,
        )
