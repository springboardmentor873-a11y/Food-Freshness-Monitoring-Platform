"""Application configuration loaded from environment variables."""

from __future__ import annotations

import json
from typing import Annotated, Any, Literal
from urllib.parse import quote_plus

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    """Validated runtime configuration for the API and its integrations."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    APP_NAME: str = "AI Food Freshness Monitoring API"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"

    JWT_SECRET_KEY: str = Field(min_length=32)
    JWT_ALGORITHM: Literal["HS256", "HS384", "HS512"] = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, gt=0, le=1_440)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, gt=0, le=90)

    MODEL_PATH: str = Field(default="app/models/efficientnetb0.keras", min_length=1)
    UPLOAD_FOLDER: str = Field(default="app/uploads", min_length=1)
    MAX_UPLOAD_SIZE_BYTES: int = Field(default=10 * 1024 * 1024, gt=0)
    SHELF_LIFE_RULES_JSON: str | None = None

    POSTGRES_HOST: str = Field(min_length=1)
    POSTGRES_PORT: int = Field(default=5432, ge=1, le=65_535)
    POSTGRES_USER: str = Field(min_length=1)
    POSTGRES_PASSWORD: str = Field(min_length=1)
    POSTGRES_DB: str = Field(min_length=1)

    MONGODB_URI: str = Field(min_length=1)
    MONGODB_DATABASE: str = Field(default="food_freshness_monitoring", min_length=1)

    CORS_ORIGINS: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:5173"]
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Any) -> list[str]:
        """Accept a JSON array or comma-separated origins from environment variables."""
        if isinstance(value, str):
            stripped_value = value.strip()
            if stripped_value.startswith("["):
                try:
                    value = json.loads(stripped_value)
                except json.JSONDecodeError as exc:
                    raise ValueError("CORS_ORIGINS must be valid JSON or comma-separated") from exc
            else:
                value = [origin.strip() for origin in stripped_value.split(",")]

        if not isinstance(value, list) or not value:
            raise ValueError("CORS_ORIGINS must contain at least one origin")
        if not all(isinstance(origin, str) and origin.strip() for origin in value):
            raise ValueError("CORS_ORIGINS entries must be non-empty strings")
        return [origin.rstrip("/") for origin in value]

    @model_validator(mode="after")
    def validate_security_and_cors(self) -> Settings:
        """Reject insecure values that would invalidate credentialed CORS or JWT use."""
        if self.JWT_SECRET_KEY.lower() in {"change-me", "secret", "your-secret-key"}:
            raise ValueError("JWT_SECRET_KEY must be a unique, securely generated secret")
        if "*" in self.CORS_ORIGINS:
            raise ValueError("CORS_ORIGINS cannot contain '*' when credentials are enabled")
        return self

    @property
    def POSTGRES_DSN(self) -> str:
        """Return the SQLAlchemy PostgreSQL connection URL."""
        username = quote_plus(self.POSTGRES_USER)
        password = quote_plus(self.POSTGRES_PASSWORD)
        database = quote_plus(self.POSTGRES_DB)
        return (
            f"postgresql+psycopg://{username}:{password}@{self.POSTGRES_HOST}:"
            f"{self.POSTGRES_PORT}/{database}"
        )

    @property
    def FRONTEND_URL(self) -> str:
        """Provide backward-compatible access to the primary permitted origin."""
        return self.CORS_ORIGINS[0]


settings = Settings()
