from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class StorageInfo(BaseModel):
    temperature: str
    humidity: str
    tips: List[str]

class PredictionResponse(BaseModel):
    id: str
    itemName: str
    category: str
    previewUrl: Optional[str] = None
    analyzedAt: str
    freshnessScore: float
    freshnessCategory: str
    confidence: float
    shelfLifeDays: int
    healthScore: float
    issues: List[str]
    storage: Dict[str, Any]
    predictionTime: float

    class Config:
        from_attributes = True

class PredictionListItem(BaseModel):
    id: str
    itemName: str
    category: str
    freshnessScore: float
    freshnessCategory: str
    confidence: float
    analyzedAt: datetime

    class Config:
        from_attributes = True
