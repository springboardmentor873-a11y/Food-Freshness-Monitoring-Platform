from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class SearchHistoryResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    food_name: str
    prediction_status: str
    category: str
    searched_at: datetime

    class Config:
        from_attributes = True
