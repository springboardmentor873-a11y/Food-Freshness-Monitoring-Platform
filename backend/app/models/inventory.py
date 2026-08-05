from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    quantity = Column(Float, nullable=False, default=1.0)
    unit = Column(String, nullable=False, default="items")
    date_added = Column(DateTime, default=datetime.utcnow, nullable=False)
    expiry_date = Column(DateTime, nullable=False)
    storage_location = Column(String, nullable=False, default="Refrigerator")
    status = Column(String, nullable=False, default="Fresh")  # "Fresh", "Nearing Expiry", "Spoiled"
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="inventory")
