from pydantic import BaseModel
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    disabled: Optional[bool] = None
    role: Optional[str] = None

class UserInDB(User):
    hashed_password: str

class InventoryItem(BaseModel):
    id: Optional[int] = None
    product_name: str
    product_type: str
    category: str
    packaging_type: Optional[str] = None
    storage_temperature: float
    humidity: float
    age_days: int
    status: Optional[str] = "Fresh"

class StorageCondition(BaseModel):
    id: Optional[int] = None
    location: Optional[str] = None
    temperature: float
    humidity: float
    timestamp: Optional[str] = None

class AlertNotification(BaseModel):
    message: str
    level: str
    timestamp: Optional[str] = None

class ImageAssessment(BaseModel):
    image_filename: str
    freshness_score: float
    freshness_label: str
    spoilage_probability: float

class ShelfLifeRequest(BaseModel):
    product_type: str
    category: str
    temperature: float
    humidity: float
    age_days: int
    packaging_type: Optional[str] = None

class RecommendationRequest(BaseModel):
    product_type: str
    category: str
    temperature: float
    humidity: float
    age_days: int
    packaging_type: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[str]
    risk_level: str
