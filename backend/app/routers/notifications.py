from typing import Optional, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.notification import NotificationResponse
from app.services.notification_service import (
    get_user_notifications,
    mark_notification_read,
    delete_notification,
)
from app.utils.deps import get_optional_current_user, get_current_user
from app.models.user import User

router = APIRouter(tags=["Notifications"])

@router.get("/notifications", response_model=List[NotificationResponse])
@router.get("/api/notifications", response_model=List[NotificationResponse])
@router.get("/api/admin/notifications", response_model=List[NotificationResponse])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else None
    return get_user_notifications(db, user_id=user_id)

@router.put("/notifications/{notification_id}/read", response_model=NotificationResponse)
@router.put("/api/notifications/{notification_id}/read", response_model=NotificationResponse)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else None
    return mark_notification_read(db, notification_id, user_id=user_id)

@router.delete("/notifications/{notification_id}")
@router.delete("/api/notifications/{notification_id}")
def remove_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else None
    return delete_notification(db, notification_id, user_id=user_id)
