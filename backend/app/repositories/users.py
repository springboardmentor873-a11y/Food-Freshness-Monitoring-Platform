"""Persistence operations for users and refresh-token records."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import RefreshToken, User


class UserRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_email(self, email: str) -> User | None:
        return self._session.scalar(select(User).where(User.email == email.lower()))

    def get_by_id(self, user_id: UUID) -> User | None:
        return self._session.get(User, user_id)

    def create(self, *, name: str, email: str, password_hash: str, role: str = "consumer") -> User:
        user = User(name=name, email=email.lower(), password_hash=password_hash, role=role)
        self._session.add(user)
        self._session.flush()
        return user

    def create_refresh_token(self, *, user_id: UUID, token_id: UUID, expires_at: datetime) -> RefreshToken:
        token = RefreshToken(user_id=user_id, token_id=token_id, expires_at=expires_at)
        self._session.add(token)
        self._session.flush()
        return token

    def get_active_refresh_token(self, token_id: UUID) -> RefreshToken | None:
        return self._session.scalar(select(RefreshToken).where(RefreshToken.token_id == token_id, RefreshToken.revoked_at.is_(None)))

    def revoke_refresh_token(self, token: RefreshToken, revoked_at: datetime) -> None:
        token.revoked_at = revoked_at
        self._session.flush()

    def update(self, user: User, **kwargs: object) -> User:
        for key, value in kwargs.items():
            if value is not None:
                if key == "email":
                    value = str(value).lower()
                setattr(user, key, value)
        self._session.flush()
        return user

    def list_all(
        self,
        search: str | None = None,
        role: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[User], int]:
        from sqlalchemy import func

        statement = select(User)
        if search:
            pattern = f"%{search}%"
            statement = statement.where(
                User.name.ilike(pattern) | User.email.ilike(pattern)
            )
        if role:
            statement = statement.where(func.lower(User.role) == role.lower())

        total = self._session.scalar(
            select(func.count()).select_from(statement.subquery())
        ) or 0

        statement = (
            statement.order_by(User.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        return list(self._session.scalars(statement)), total


