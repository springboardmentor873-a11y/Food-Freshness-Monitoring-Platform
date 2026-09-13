"""Pydantic contracts for inventory operations."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class InventoryFields(BaseModel):
    food_name: str = Field(min_length=1, max_length=160)
    category: str = Field(min_length=1, max_length=80)
    quantity: int = Field(gt=0)
    purchase_date: date
    expiry_date: date
    storage_location: str = Field(min_length=1, max_length=160)
    prediction: str | None = None
    confidence: float | None = None
    freshness_status: str | None = None
    storage_temperature: float | None = None
    storage_humidity: float | None = None

    @model_validator(mode="after")
    def validate_dates(self) -> "InventoryFields":
        if self.expiry_date < self.purchase_date:
            raise ValueError("expiry_date cannot precede purchase_date")
        return self


class InventoryCreate(InventoryFields):
    pass


class InventoryUpdate(BaseModel):
    food_name: str | None = Field(default=None, min_length=1, max_length=160)
    category: str | None = Field(default=None, min_length=1, max_length=80)
    quantity: int | None = Field(default=None, gt=0)
    purchase_date: date | None = None
    expiry_date: date | None = None
    storage_location: str | None = Field(default=None, min_length=1, max_length=160)
    prediction: str | None = None
    confidence: float | None = None
    freshness_status: str | None = None
    storage_temperature: float | None = None
    storage_humidity: float | None = None



class InventoryResponse(InventoryFields):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
    image_path: str | None
    prediction: str | None
    confidence: float | None
    freshness_status: str | None
    created_at: datetime
    updated_at: datetime


class InventoryPage(BaseModel):
    items: list[InventoryResponse]
    total: int
    page: int
    page_size: int


class BulkDeleteRequest(BaseModel):
    item_ids: list[UUID] = Field(min_length=1, max_length=100)


class BulkImportResponse(BaseModel):
    imported_count: int
    failed_count: int
    errors: list[str] = Field(default_factory=list)

