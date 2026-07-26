from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models import UserRole, FoodCategory, FreshnessCategory


# ---------- Auth / Users ----------

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.consumer


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ---------- Food Inventory ----------

class FoodItemCreate(BaseModel):
    name: str
    category: FoodCategory
    batch_number: Optional[str] = None
    quantity: float = 1.0
    unit: str = "kg"
    packaging_type: str = "unpackaged"
    storage_temperature_c: Optional[float] = None
    storage_humidity_pct: Optional[float] = None
    expiry_date: Optional[datetime] = None


class FoodItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    storage_temperature_c: Optional[float] = None
    storage_humidity_pct: Optional[float] = None
    expiry_date: Optional[datetime] = None


class FoodItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: FoodCategory
    batch_number: Optional[str]
    quantity: float
    unit: str
    packaging_type: str
    storage_temperature_c: Optional[float]
    storage_humidity_pct: Optional[float]
    received_date: datetime
    expiry_date: Optional[datetime]


# ---------- Freshness Assessment ----------

class FreshnessAssessmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    food_item_id: int
    image_path: Optional[str]
    color_score: float
    texture_score: float
    mold_risk_score: float
    bruising_risk_score: float
    visual_condition_score: float
    storage_condition_score: float
    shelf_life_score: float
    product_age_score: float
    overall_freshness_score: float
    freshness_category: FreshnessCategory
    predicted_remaining_shelf_life_days: Optional[float]
    spoilage_probability: Optional[float]
    recommendations: Optional[str]
    created_at: datetime


class DashboardSummary(BaseModel):
    total_items: int
    fresh_count: int
    near_spoilage_count: int
    spoiled_count: int
    average_freshness_score: float
    items_expiring_soon: List[FoodItemOut] = []
