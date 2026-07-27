from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="Consumer")  # Consumer, Retail Manager, Warehouse Operator, Food Quality Inspector, Admin
    created_at = Column(DateTime, default=datetime.utcnow)

class InventoryItem(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Fruits, Vegetables, Dairy Products, Meat & Poultry, Seafood, Bakery Products, Packaged Foods, Beverages
    batch_number = Column(String, nullable=True)
    quantity = Column(Float, nullable=False, default=1.0)
    registered_at = Column(DateTime, default=datetime.utcnow)
    expiry_date = Column(DateTime, nullable=False)
    storage_temp = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    packaging_type = Column(String, nullable=True)  # Loose, Plastic Wrap, Vacuum, Box
    current_status = Column(String, nullable=False, default="Fresh")  # Fresh, Good, Acceptable, Near Spoilage, Spoiled

    analyses = relationship("AnalysisHistory", back_populates="item", cascade="all, delete-orphan")

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory.id"), nullable=True)
    image_url = Column(String, nullable=False)
    category = Column(String, nullable=True)
    freshness_score = Column(Float, nullable=False)  # 0 to 100
    quality_class = Column(String, nullable=False)  # Fresh, Good, Acceptable, Near Spoilage, Spoiled
    spoilage_prob = Column(Float, nullable=False)  # 0.0 to 1.0
    color_degradation = Column(Float, nullable=False)  # 0.0 to 1.0
    texture_change = Column(Float, nullable=False)  # 0.0 to 1.0
    mold_detected = Column(Boolean, default=False)
    bruising_detected = Column(Boolean, default=False)
    physical_damage_detected = Column(Boolean, default=False)
    analyzed_at = Column(DateTime, default=datetime.utcnow)

    item = relationship("InventoryItem", back_populates="analyses")

class StorageLog(Base):
    __tablename__ = "storage_logs"

    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    air_circulation = Column(String, nullable=False, default="Good")  # Good, Fair, Poor
    light_exposure = Column(String, nullable=False, default="Low")  # Low, Medium, High
    logged_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Freshness, Shelf-Life, Spoilage, Storage, Inventory
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
