"""Analytics response models."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TrendPoint(BaseModel):
    date: str
    fresh: int
    spoiled: int


class CategoryPoint(BaseModel):
    category: str
    count: int


class ActivityPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    prediction: str
    confidence: float
    freshness_status: str
    created_at: datetime


class AnalyticsOverview(BaseModel):
    total_foods: int
    total_predictions: int
    fresh_percentage: float
    spoiled_percentage: float
    average_confidence: float
    near_expiry_count: int = 0
    waste_prevented_kg: float = 0.0
    category_distribution: list[CategoryPoint]
    prediction_trends: list[TrendPoint]
    recent_activity: list[ActivityPoint]

