"""Authenticated notification-center endpoints."""
from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_active_user
from app.database.models import User
from app.database.postgres import get_db
from app.schemas.notifications import NotificationPage, UnreadCount
from app.services.notifications import NotificationNotFoundError, NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])
def service(db: Annotated[Session, Depends(get_db)]) -> NotificationService: return NotificationService(db)

@router.get("", response_model=NotificationPage)
def list_notifications(user: Annotated[User, Depends(get_current_active_user)], handler: Annotated[NotificationService, Depends(service)], notification_type: str | None = None, is_read: bool | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    handler.sync_inventory_alerts(user); items, total = handler.list(user, notification_type, is_read, page, page_size); return NotificationPage(items=items, total=total, page=page, page_size=page_size)

@router.get("/unread-count", response_model=UnreadCount)
def unread_count(user: Annotated[User, Depends(get_current_active_user)], handler: Annotated[NotificationService, Depends(service)]): return UnreadCount(unread_count=handler.unread_count(user))

@router.patch("/{notification_id}/read", status_code=status.HTTP_204_NO_CONTENT)
def mark_read(notification_id: UUID, user: Annotated[User, Depends(get_current_active_user)], handler: Annotated[NotificationService, Depends(service)]):
    try: handler.mark_read(user, notification_id)
    except NotificationNotFoundError as exc: raise HTTPException(404, str(exc)) from exc

@router.post("/mark-all-read", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_read(user: Annotated[User, Depends(get_current_active_user)], handler: Annotated[NotificationService, Depends(service)]): handler.mark_all_read(user)

@router.post("/weekly-summary", status_code=status.HTTP_204_NO_CONTENT)
def weekly_summary(user: Annotated[User, Depends(get_current_active_user)], handler: Annotated[NotificationService, Depends(service)]): handler.create_weekly_summary(user)

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(notification_id: UUID, user: Annotated[User, Depends(get_current_active_user)], handler: Annotated[NotificationService, Depends(service)]):
    try: handler.delete(user, notification_id)
    except NotificationNotFoundError as exc: raise HTTPException(404, str(exc)) from exc
