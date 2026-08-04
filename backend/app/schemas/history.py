"""Pydantic response contracts for prediction history."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PredictionHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
    image_path: str
    prediction: str
    confidence: float
    freshness_status: str
    created_at: datetime


class PredictionHistoryPage(BaseModel):
    items: list[PredictionHistoryResponse]
    total: int
    page: int
    page_size: int
