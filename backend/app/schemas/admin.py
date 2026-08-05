from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr

class AdminLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class AdminUserListItem(BaseModel):
    id: int
    full_name: str
    username: str
    email: str
    mobile_number: Optional[str] = None
    role: str
    is_active: bool
    status: str  # "Online" or "Offline"
    last_login: Optional[datetime] = None
    last_active_time: Optional[datetime] = None
    prediction_count: int = 0
    search_count: int = 0

    class Config:
        from_attributes = True

class AdminDashboardStats(BaseModel):
    totalUsers: int
    activeUsers: int
    offlineUsers: int
    totalPredictions: int
    freshPredictions: int
    spoiledPredictions: int
    mostPredictedFood: str
    mostSearchedFood: str
    predictionsToday: int
    predictionsThisWeek: int
