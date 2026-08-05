import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "🍃 AI Powered Food Freshness Monitoring Platform"
    SECRET_KEY: str = "super-secret-key-food-freshness-platform-jwt-authentication"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 4320
    DATABASE_URL: str = "sqlite:///./food_freshness.db"
    MODEL_PATH: str = "trained_model/best_model.keras"
    UPLOAD_DIR: str = "uploads"
    
    DEFAULT_ADMIN_USERNAME: str = "admin"
    DEFAULT_ADMIN_PASSWORD: str = "admin123"
    DEFAULT_ADMIN_EMAIL: str = "admin@foodfreshness.com"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
