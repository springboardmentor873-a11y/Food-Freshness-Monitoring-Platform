from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class InventoryCreate(BaseModel):
    food_name: str
    category: str
    quantity: float = 1.0
    unit: str = "items"
    expiry_date: datetime
    storage_location: Optional[str] = "Refrigerator"
    notes: Optional[str] = None

class InventoryUpdate(BaseModel):
    food_name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    expiry_date: Optional[datetime] = None
    storage_location: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class InventoryResponse(BaseModel):
    id: int
    user_id: int
    food_name: str
    category: str
    quantity: float
    unit: str
    date_added: datetime
    expiry_date: datetime
    storage_location: str
    status: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True
