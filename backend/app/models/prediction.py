from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    item_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    preview_url = Column(String, nullable=True)
    freshness_score = Column(Float, nullable=False)
    freshness_category = Column(String, nullable=False)  # "Fresh", "Good", "Acceptable", "Near Spoilage", "Spoiled"
    confidence = Column(Float, nullable=False)
    shelf_life_days = Column(Integer, nullable=False)
    health_score = Column(Float, nullable=False)
    issues_json = Column(Text, nullable=True)
    storage_json = Column(Text, nullable=True)
    predicted_class = Column(String, nullable=False)
    raw_probabilities_json = Column(Text, nullable=True)
    prediction_time_ms = Column(Float, nullable=False, default=0.0)
    analyzed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="predictions")
