from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.notification import Notification

def get_user_notifications(db: Session, user_id: Optional[int] = None) -> List[Notification]:
    query = db.query(Notification)
    if user_id:
        query = query.filter((Notification.user_id == user_id) | (Notification.user_id.is_(None)))
    
    notifications = query.order_by(Notification.created_at.desc()).limit(50).all()

    # If empty, return initial helpful sample notifications
    if not notifications:
        samples = [
            Notification(
                user_id=user_id,
                title="System Ready 🍃",
                message="AI Food Freshness Monitoring Platform initialized successfully.",
                type="system",
                is_read=False,
                created_at=datetime.utcnow()
            ),
            Notification(
                user_id=user_id,
                title="Optimal Storage Tip",
                message="Store leafy green vegetables in high humidity drawers (90-95%) for maximum shelf life.",
                type="info",
                is_read=False,
                created_at=datetime.utcnow()
            )
        ]
        for s in samples:
            db.add(s)
        db.commit()
        notifications = query.order_by(Notification.created_at.desc()).all()

    return notifications

def mark_notification_read(db: Session, notification_id: int, user_id: Optional[int] = None) -> Notification:
    query = db.query(Notification).filter(Notification.id == notification_id)
    if user_id:
        query = query.filter((Notification.user_id == user_id) | (Notification.user_id.is_(None)))
    n = query.first()
    if not n:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    n.is_read = True
    db.commit()
    db.refresh(n)
    return n

def delete_notification(db: Session, notification_id: int, user_id: Optional[int] = None):
    query = db.query(Notification).filter(Notification.id == notification_id)
    if user_id:
        query = query.filter((Notification.user_id == user_id) | (Notification.user_id.is_(None)))
    n = query.first()
    if not n:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    db.delete(n)
    db.commit()
    return {"message": "Notification deleted"}
