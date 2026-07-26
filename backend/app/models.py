import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text, Boolean
)
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(str, enum.Enum):
    consumer = "consumer"
    retail_manager = "retail_manager"
    warehouse_operator = "warehouse_operator"
    food_quality_inspector = "food_quality_inspector"
    administrator = "administrator"


class FoodCategory(str, enum.Enum):
    fruits = "fruits"
    vegetables = "vegetables"
    dairy = "dairy"
    meat_poultry = "meat_poultry"
    seafood = "seafood"
    bakery = "bakery"
    packaged_foods = "packaged_foods"
    beverages = "beverages"


class FreshnessCategory(str, enum.Enum):
    fresh = "fresh"
    good = "good"
    acceptable = "acceptable"
    near_spoilage = "near_spoilage"
    spoiled = "spoiled"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.consumer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    food_items = relationship("FoodItem", back_populates="owner")


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(Enum(FoodCategory), nullable=False)
    batch_number = Column(String(80), index=True)
    quantity = Column(Float, default=1.0)
    unit = Column(String(20), default="kg")

    packaging_type = Column(String(50), default="unpackaged")
    storage_temperature_c = Column(Float, nullable=True)
    storage_humidity_pct = Column(Float, nullable=True)

    received_date = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(DateTime, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="food_items")

    assessments = relationship(
        "FreshnessAssessment", back_populates="food_item", cascade="all, delete-orphan"
    )


class FreshnessAssessment(Base):
    """A single freshness assessment run against a food item, typically
    triggered by an image upload."""
    __tablename__ = "freshness_assessments"

    id = Column(Integer, primary_key=True, index=True)
    food_item_id = Column(Integer, ForeignKey("food_items.id"))
    food_item = relationship("FoodItem", back_populates="assessments")

    image_path = Column(String(500), nullable=True)

    # Image analysis sub-scores (0-100)
    color_score = Column(Float)
    texture_score = Column(Float)
    mold_risk_score = Column(Float)      # higher = more suspected mold
    bruising_risk_score = Column(Float)  # higher = more suspected bruising/damage
    visual_condition_score = Column(Float)  # aggregate of the above (0-100)

    storage_condition_score = Column(Float)   # 0-100
    shelf_life_score = Column(Float)          # 0-100
    product_age_score = Column(Float)         # 0-100

    overall_freshness_score = Column(Float)   # weighted final score, 0-100
    freshness_category = Column(Enum(FreshnessCategory))

    predicted_remaining_shelf_life_days = Column(Float, nullable=True)
    spoilage_probability = Column(Float, nullable=True)  # 0-1

    recommendations = Column(Text, nullable=True)  # newline-separated text
    created_at = Column(DateTime, default=datetime.utcnow)
