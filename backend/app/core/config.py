from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AI Food Freshness Monitoring API"
    APP_VERSION: str = "1.0.0"

    API_PREFIX: str = "/api/v1"

    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()