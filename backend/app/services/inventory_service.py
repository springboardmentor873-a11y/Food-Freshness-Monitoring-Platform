from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.inventory import InventoryItem
from app.models.notification import Notification
from app.schemas.inventory import InventoryCreate, InventoryUpdate

def evaluate_expiry_status(expiry_date: datetime) -> str:
    now = datetime.utcnow()
    if expiry_date < now:
        return "Spoiled"
    elif expiry_date <= now + timedelta(days=2):
        return "Nearing Expiry"
    else:
        return "Fresh"

def create_inventory_item(db: Session, user_id: int, data: InventoryCreate) -> InventoryItem:
    auto_status = evaluate_expiry_status(data.expiry_date)

    item = InventoryItem(
        user_id=user_id,
        food_name=data.food_name,
        category=data.category,
        quantity=data.quantity,
        unit=data.unit,
        expiry_date=data.expiry_date,
        storage_location=data.storage_location or "Refrigerator",
        status=auto_status,
        notes=data.notes,
        date_added=datetime.utcnow()
    )
    db.add(item)

    if auto_status in ["Spoiled", "Nearing Expiry"]:
        notif = Notification(
            user_id=user_id,
            title=f"Inventory Alert: {item.food_name}",
            message=f"'{item.food_name}' is currently {auto_status.lower()} (Expiry: {data.expiry_date.strftime('%Y-%m-%d')}).",
            type="expiry" if auto_status == "Nearing Expiry" else "spoilage",
            is_read=False,
            created_at=datetime.utcnow()
        )
        db.add(notif)

    db.commit()
    db.refresh(item)
    return item

def get_user_inventory(
    db: Session, user_id: int, category: Optional[str] = None, status_filter: Optional[str] = None
) -> List[InventoryItem]:
    query = db.query(InventoryItem).filter(InventoryItem.user_id == user_id)

    if category and category.lower() != "all":
        query = query.filter(InventoryItem.category == category)
    if status_filter and status_filter.lower() != "all":
        query = query.filter(InventoryItem.status == status_filter)

    items = query.order_by(InventoryItem.expiry_date.asc()).all()

    # Recalculate status dynamically
    now = datetime.utcnow()
    updated = False
    for item in items:
        new_st = evaluate_expiry_status(item.expiry_date)
        if new_st != item.status:
            item.status = new_st
            updated = True
    if updated:
        db.commit()

    return items

def update_inventory_item(db: Session, item_id: int, user_id: int, data: InventoryUpdate) -> InventoryItem:
    item = db.query(InventoryItem).filter(
        InventoryItem.id == item_id, InventoryItem.user_id == user_id
    ).first()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")

    if data.food_name is not None:
        item.food_name = data.food_name
    if data.category is not None:
        item.category = data.category
    if data.quantity is not None:
        item.quantity = data.quantity
    if data.unit is not None:
        item.unit = data.unit
    if data.expiry_date is not None:
        item.expiry_date = data.expiry_date
        item.status = evaluate_expiry_status(data.expiry_date)
    if data.storage_location is not None:
        item.storage_location = data.storage_location
    if data.status is not None:
        item.status = data.status
    if data.notes is not None:
        item.notes = data.notes

    db.commit()
    db.refresh(item)
    return item

def delete_inventory_item(db: Session, item_id: int, user_id: int):
    item = db.query(InventoryItem).filter(
        InventoryItem.id == item_id, InventoryItem.user_id == user_id
    ).first()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")

    db.delete(item)
    db.commit()
    return {"message": "Inventory item deleted successfully"}
