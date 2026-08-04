"""Reusable FastAPI dependencies for authentication and authorization."""

from __future__ import annotations

from collections.abc import Callable
from typing import Annotated, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database.models import User
from app.database.postgres import get_db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


_credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    """Validate an access token and resolve its user from PostgreSQL."""
    try:
        payload: dict[str, Any] = decode_access_token(token)
    except InvalidTokenError as exc:
        raise _credentials_exception from exc

    if payload.get("token_type") != "access":
        raise _credentials_exception
    try:
        from uuid import UUID

        user_id = UUID(str(payload["sub"]))
    except (KeyError, ValueError, TypeError):
        raise _credentials_exception
    user = db.get(User, user_id)
    if user is None:
        raise _credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Return the authenticated user for endpoints requiring an active account."""
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive")
    return current_user


def require_role(*allowed_roles: str) -> Callable[..., User]:
    """Create a dependency that permits access only to the specified roles."""
    normalized_roles = frozenset(role.strip() for role in allowed_roles if role.strip())
    if not normalized_roles:
        raise ValueError("At least one allowed role is required")

    async def role_dependency(
        current_user: Annotated[User, Depends(get_current_active_user)],
    ) -> User:
        user_role = (current_user.role or "consumer").lower().strip()
        if user_role not in normalized_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        return current_user

    return role_dependency


require_admin = require_role("admin")
require_manager = require_role("admin", "manager")

