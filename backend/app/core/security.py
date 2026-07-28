"""Password and JWT primitives used by the authentication layer."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from jwt import InvalidTokenError
from pwdlib import PasswordHash

from app.core.config import settings


password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Return an Argon2 hash for a plaintext password."""
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Safely verify a plaintext password against a stored hash."""
    try:
        return password_hasher.verify(password, password_hash)
    except (ValueError, TypeError):
        return False


def create_access_token(
    *,
    subject: str,
    role: str,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a signed access token containing the user's identity and role."""
    now = datetime.now(timezone.utc)
    lifetime = expires_delta or timedelta(
        minutes=_get_access_token_expire_minutes()
    )
    payload = {
        "sub": subject,
        "role": role,
        "iat": now,
        "exp": now + lifetime,
    }
    return jwt.encode(
        payload,
        _get_jwt_secret_key(),
        algorithm=_get_jwt_algorithm(),
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate an access token.

    Raises:
        jwt.InvalidTokenError: If the token is malformed, expired, or invalid.
    """
    payload = jwt.decode(
        token,
        _get_jwt_secret_key(),
        algorithms=[_get_jwt_algorithm()],
    )
    subject = payload.get("sub")
    role = payload.get("role")
    if not isinstance(subject, str) or not subject or not isinstance(role, str) or not role:
        raise InvalidTokenError("Token is missing required claims")
    return payload


def _get_jwt_secret_key() -> str:
    secret_key = getattr(settings, "JWT_SECRET_KEY", None)
    if not isinstance(secret_key, str) or not secret_key.strip():
        raise RuntimeError("JWT_SECRET_KEY must be configured")
    return secret_key


def _get_jwt_algorithm() -> str:
    algorithm = getattr(settings, "JWT_ALGORITHM", "HS256")
    if not isinstance(algorithm, str) or not algorithm.strip():
        raise RuntimeError("JWT_ALGORITHM must be configured")
    return algorithm


def _get_access_token_expire_minutes() -> int:
    value = getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 30)
    if not isinstance(value, int) or value <= 0:
        raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES must be a positive integer")
    return value
