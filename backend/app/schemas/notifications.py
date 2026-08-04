from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID; notification_type: str; title: str; message: str; is_read: bool; created_at: datetime

class NotificationPage(BaseModel):
    items: list[NotificationResponse]; total: int; page: int; page_size: int

class UnreadCount(BaseModel): unread_count: int
