"""Generation and lifecycle management for real user notifications."""
from datetime import date, datetime, timedelta, timezone
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.database.models import InventoryItem, Notification, PredictionHistory, User

class NotificationNotFoundError(ValueError): pass

class NotificationService:
    def __init__(self, session: Session) -> None: self._session = session
    def _create_once(self, user: User, kind: str, title: str, message: str, key: str) -> None:
        event_key = f"{user.id}:{key}"
        if not self._session.scalar(select(Notification.id).where(Notification.event_key == event_key)):
            self._session.add(Notification(user_id=user.id, notification_type=kind, title=title, message=message, event_key=event_key))
    def create_prediction_notifications(self, user: User, history: PredictionHistory) -> None:
        self._create_once(user, "prediction_completed", "AI prediction completed", f"{history.prediction.replace('_', ' ').title()} was detected with {history.confidence * 100:.2f}% confidence.", f"prediction:{history.id}")
        if history.freshness_status == "spoiled": self._create_once(user, "spoiled_food_alert", "Spoiled food alert", f"{history.prediction.replace('_', ' ').title()} was identified as spoiled. Do not consume it.", f"spoiled:{history.id}")
        self._session.commit()
    def sync_inventory_alerts(self, user: User) -> None:
        today = date.today(); warning = today + timedelta(days=3)
        items = self._session.scalars(select(InventoryItem).where(InventoryItem.user_id == user.id)).all()
        for item in items:
            if item.expiry_date <= warning: self._create_once(user, "expiry_reminder", "Expiry reminder", f"{item.food_name} expires on {item.expiry_date.isoformat()}.", f"expiry:{item.id}:{item.expiry_date.isoformat()}")
            if item.quantity <= 5: self._create_once(user, "inventory_low", "Inventory low", f"{item.food_name} has only {item.quantity} units remaining.", f"low:{item.id}:{item.quantity}")
        self._session.commit()
    def create_weekly_summary(self, user: User) -> None:
        since = datetime.now(timezone.utc) - timedelta(days=7)
        total, fresh = self._session.execute(select(func.count(), func.count().filter(PredictionHistory.freshness_status == "fresh")).where(PredictionHistory.user_id == user.id, PredictionHistory.created_at >= since)).one()
        week_key = datetime.now(timezone.utc).strftime("%G-W%V")
        self._create_once(user, "weekly_summary", "Weekly prediction summary", f"{int(total or 0)} predictions were completed this week; {int(fresh or 0)} were fresh.", f"weekly:{week_key}")
        self._session.commit()
    def list(self, user: User, notification_type: str | None, is_read: bool | None, page: int, page_size: int) -> tuple[list[Notification], int]:
        statement = select(Notification).where(Notification.user_id == user.id)
        if notification_type: statement = statement.where(Notification.notification_type == notification_type)
        if is_read is not None: statement = statement.where(Notification.is_read == is_read)
        total = self._session.scalar(select(func.count()).select_from(statement.subquery())) or 0
        return list(self._session.scalars(statement.order_by(Notification.created_at.desc()).offset((page-1)*page_size).limit(page_size))), total
    def unread_count(self, user: User) -> int: return self._session.scalar(select(func.count()).select_from(Notification).where(Notification.user_id == user.id, Notification.is_read.is_(False))) or 0
    def mark_read(self, user: User, notification_id: UUID) -> None:
        item = self._session.scalar(select(Notification).where(Notification.id == notification_id, Notification.user_id == user.id))
        if not item: raise NotificationNotFoundError("Notification was not found")
        item.is_read = True; self._session.commit()
    def mark_all_read(self, user: User) -> None:
        for item in self._session.scalars(select(Notification).where(Notification.user_id == user.id, Notification.is_read.is_(False))): item.is_read = True
        self._session.commit()
    def delete(self, user: User, notification_id: UUID) -> None:
        item = self._session.scalar(select(Notification).where(Notification.id == notification_id, Notification.user_id == user.id))
        if not item: raise NotificationNotFoundError("Notification was not found")
        self._session.delete(item); self._session.commit()
