from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    food_name = Column(String, nullable=False)
    prediction_status = Column(String, nullable=False)
    category = Column(String, nullable=False)
    searched_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="search_history")
