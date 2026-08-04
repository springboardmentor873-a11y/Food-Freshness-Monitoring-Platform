"""Pydantic schemas for administration and user management."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UserAdminResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserRoleUpdate(BaseModel):
    role: str = Field(min_length=1, max_length=50)
    is_active: bool | None = None


class AdminUsersPage(BaseModel):
    items: list[UserAdminResponse]
    total: int
    page: int
    page_size: int


class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    admin_users: int
    total_predictions: int
    total_inventory_items: int
