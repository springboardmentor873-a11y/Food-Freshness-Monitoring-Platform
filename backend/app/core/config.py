"""
Application configuration.

Reads settings from environment variables (see backend/.env.example).
Falls back to sane local-dev defaults (SQLite) so the app runs with zero setup.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Food Freshness Monitoring Platform API"
    environment: str = "development"

    # Database: defaults to a local SQLite file. Set DATABASE_URL to point at
    # PostgreSQL in production, e.g.
    # postgresql://user:password@localhost:5432/food_freshness
    database_url: str = "sqlite:///./food_freshness.db"

    # JWT auth
    secret_key: str = "CHANGE_ME_IN_PRODUCTION_" \
                       "use_a_long_random_string_from_openssl_rand_hex_32"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # File uploads
    upload_dir: str = "./uploads"
    max_upload_mb: int = 8

    class Config:
        env_file = ".env"


settings = Settings()
