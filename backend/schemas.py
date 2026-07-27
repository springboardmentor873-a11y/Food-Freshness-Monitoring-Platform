from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# --- User Schemas ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "Consumer"  # Consumer, Retail Manager, Warehouse Operator, Food Quality Inspector, Admin

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Analysis Schemas ---
class AnalysisCreate(BaseModel):
    item_id: Optional[int] = None
    image_url: str
    category: Optional[str] = None
    freshness_score: float
    quality_class: str
    spoilage_prob: float
    color_degradation: float
    texture_change: float
    mold_detected: bool
    bruising_detected: bool
    physical_damage_detected: bool

class AnalysisResponse(BaseModel):
    id: int
    item_id: Optional[int] = None
    image_url: str
    category: Optional[str] = None
    freshness_score: float
    quality_class: str
    spoilage_prob: float
    color_degradation: float
    texture_change: float
    mold_detected: bool
    bruising_detected: bool
    physical_damage_detected: bool
    analyzed_at: datetime

    class Config:
        from_attributes = True

# --- Inventory Schemas ---
class InventoryCreate(BaseModel):
    name: str
    category: str
    batch_number: Optional[str] = None
    quantity: float
    expiry_date: datetime
    storage_temp: Optional[float] = None
    humidity: Optional[float] = None
    packaging_type: Optional[str] = None

class InventoryUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    batch_number: Optional[str] = None
    quantity: Optional[float] = None
    expiry_date: Optional[datetime] = None
    storage_temp: Optional[float] = None
    humidity: Optional[float] = None
    packaging_type: Optional[str] = None
    current_status: Optional[str] = None

class InventoryResponse(BaseModel):
    id: int
    name: str
    category: str
    batch_number: Optional[str] = None
    quantity: float
    registered_at: datetime
    expiry_date: datetime
    storage_temp: Optional[float] = None
    humidity: Optional[float] = None
    packaging_type: Optional[str] = None
    current_status: str
    analyses: List[AnalysisResponse] = []

    class Config:
        from_attributes = True

# --- StorageLog Schemas ---
class StorageLogCreate(BaseModel):
    temperature: float
    humidity: float
    air_circulation: str = "Good"  # Good, Fair, Poor
    light_exposure: str = "Low"  # Low, Medium, High

class StorageLogResponse(BaseModel):
    id: int
    temperature: float
    humidity: float
    air_circulation: str
    light_exposure: str
    logged_at: datetime

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
