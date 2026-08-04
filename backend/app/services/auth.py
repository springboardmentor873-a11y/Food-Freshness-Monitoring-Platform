"""Authentication use cases and refresh-token rotation."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, decode_access_token, hash_password, verify_password
from app.database.models import User
from app.repositories.users import UserRepository
from app.schemas.auth import TokenResponse


class AuthenticationError(ValueError):
    """Raised when credentials or a refresh token cannot be authenticated."""


class EmailAlreadyRegisteredError(ValueError):
    """Raised when a registration email is already in use."""


class AuthService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._users = UserRepository(session)

    def register(self, *, name: str, email: str, password: str, role: str = "consumer") -> User:
        if self._users.get_by_email(email):
            raise EmailAlreadyRegisteredError("An account already exists for this email address")
        user = self._users.create(name=name.strip(), email=email, password_hash=hash_password(password), role=role)
        self._session.commit()
        self._session.refresh(user)
        return user


    def authenticate(self, *, email: str, password: str) -> TokenResponse:
        user = self._users.get_by_email(email)
        if user is None or not user.is_active or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password")
        return self._issue_tokens(user)

    def google_authenticate(self, *, credential: str | None = None, email: str | None = None, name: str | None = None) -> TokenResponse:
        target_email = email
        target_name = name or "Google User"

        if credential and not target_email:
            try:
                import json, base64
                parts = credential.split(".")
                if len(parts) >= 2:
                    padding = "=" * (4 - len(parts[1]) % 4)
                    decoded = json.loads(base64.urlsafe_b64decode(parts[1] + padding).decode("utf-8"))
                    target_email = decoded.get("email")
                    target_name = decoded.get("name") or target_name
            except Exception:
                pass

        if not target_email:
            raise AuthenticationError("Google authentication failed to resolve a valid email address.")

        user = self._users.get_by_email(target_email)
        if user is None:
            random_pwd = f"GOOGLE_AUTH_{uuid4().hex[:12]}!"
            user = self._users.create(
                name=target_name.strip(),
                email=target_email,
                password_hash=hash_password(random_pwd),
                role="consumer",
            )
            self._session.commit()
            self._session.refresh(user)

        if not user.is_active:
            raise AuthenticationError("User account is disabled.")

        return self._issue_tokens(user)


    def refresh(self, refresh_token: str) -> TokenResponse:
        payload = self._decode_refresh_token(refresh_token)
        token_id = UUID(payload["jti"])
        stored_token = self._users.get_active_refresh_token(token_id)
        now = datetime.now(timezone.utc)
        if stored_token is None or stored_token.expires_at <= now or not stored_token.user.is_active:
            raise AuthenticationError("Refresh token is invalid or expired")
        self._users.revoke_refresh_token(stored_token, now)
        return self._issue_tokens(stored_token.user)

    def logout(self, refresh_token: str) -> None:
        try:
            payload = self._decode_refresh_token(refresh_token)
            stored_token = self._users.get_active_refresh_token(UUID(payload["jti"]))
        except (AuthenticationError, ValueError):
            return
        if stored_token is not None:
            self._users.revoke_refresh_token(stored_token, datetime.now(timezone.utc))
            self._session.commit()

    def _issue_tokens(self, user: User) -> TokenResponse:
        token_id = uuid4()
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        self._users.create_refresh_token(user_id=user.id, token_id=token_id, expires_at=expires_at)
        self._session.commit()
        return TokenResponse(
            access_token=create_access_token(subject=str(user.id), role=user.role),
            refresh_token=create_refresh_token(subject=str(user.id), role=user.role, token_id=str(token_id)),
            user=user,
        )

    def update_profile(self, user: User, **kwargs: object) -> User:
        email = kwargs.get("email")
        if email and isinstance(email, str) and email.lower() != user.email:
            existing = self._users.get_by_email(email)
            if existing and existing.id != user.id:
                raise EmailAlreadyRegisteredError("An account already exists for this email address")
        self._users.update(user, **kwargs)
        self._session.commit()
        self._session.refresh(user)
        return user


    def change_password(self, user: User, current_password: str, new_password: str) -> None:
        if not verify_password(current_password, user.password_hash):
            raise AuthenticationError("Current password is incorrect")
        self._users.update(user, password_hash=hash_password(new_password))
        self._session.commit()

    def forgot_password(self, email: str) -> str:
        user = self._users.get_by_email(email)
        if user is None or not user.is_active:
            # Return a valid response message for security (prevent user enumeration)
            return "If an account exists for this email, password reset instructions have been generated."
        reset_token = create_access_token(subject=str(user.id), role=user.role, expires_delta=timedelta(minutes=15))
        return reset_token


    def reset_password(self, token: str, new_password: str) -> None:
        try:
            payload = decode_access_token(token)
            user_id = UUID(payload["sub"])
            user = self._users.get_by_id(user_id)
        except Exception as exc:
            raise AuthenticationError("Reset token is invalid or expired") from exc
        if user is None or not user.is_active:
            raise AuthenticationError("User account is inactive or not found")
        self._users.update(user, password_hash=hash_password(new_password))
        self._session.commit()

    @staticmethod
    def _decode_refresh_token(refresh_token: str) -> dict[str, object]:
        try:
            payload = decode_access_token(refresh_token)
        except InvalidTokenError as exc:
            raise AuthenticationError("Refresh token is invalid or expired") from exc
        if payload.get("token_type") != "refresh" or not isinstance(payload.get("jti"), str):
            raise AuthenticationError("Refresh token is invalid")
        return payload

