from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class UserLoginHistory(Base):
    __tablename__ = "user_login_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    login_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    logout_time = Column(DateTime, nullable=True)
    last_active_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String, default="Online", nullable=False)  # "Online" or "Offline"

    user = relationship("User", back_populates="login_history")
