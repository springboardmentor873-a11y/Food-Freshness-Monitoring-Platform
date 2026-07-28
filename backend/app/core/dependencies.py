"""Reusable FastAPI dependencies for authentication and authorization."""

from __future__ import annotations

from collections.abc import Callable
from typing import Annotated, Any, TypedDict

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError

from app.core.security import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


class CurrentUser(TypedDict):
    """Identity claims available to authenticated route handlers."""

    id: str
    role: str


_credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> CurrentUser:
    """Validate the bearer token and return its authenticated identity claims."""
    try:
        payload: dict[str, Any] = decode_access_token(token)
    except InvalidTokenError as exc:
        raise _credentials_exception from exc

    subject = payload["sub"]
    role = payload["role"]
    if not isinstance(subject, str) or not isinstance(role, str):
        raise _credentials_exception
    return {"id": subject, "role": role}


async def get_current_active_user(
    current_user: Annotated[CurrentUser, Depends(get_current_user)],
) -> CurrentUser:
    """Return the authenticated user for endpoints requiring an active account."""
    return current_user


def require_role(*allowed_roles: str) -> Callable[..., CurrentUser]:
    """Create a dependency that permits access only to the specified roles."""
    normalized_roles = frozenset(role.strip() for role in allowed_roles if role.strip())
    if not normalized_roles:
        raise ValueError("At least one allowed role is required")

    async def role_dependency(
        current_user: Annotated[CurrentUser, Depends(get_current_active_user)],
    ) -> CurrentUser:
        if current_user["role"] not in normalized_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        return current_user

    return role_dependency
