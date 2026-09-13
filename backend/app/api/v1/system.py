"""FastAPI router for system utilities and enterprise demo data seeding."""

from datetime import datetime, timedelta
from typing import Annotated, Any
from uuid import uuid4

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.models import InventoryItem, Notification, PredictionHistory, User
from app.database.postgres import get_db

router = APIRouter(
    prefix="/system",
    tags=["system"],
)

DEMO_ITEMS = [
    {
        "food_name": "Fresh Red Apples",
        "category": "Fruits",
        "quantity": 15,
        "days_ago": 2,
        "expiry_days": 8,
        "location": "Main Refrigerator Shelf 1",
        "prediction": "fresh_apple",
        "confidence": 0.984,
        "status": "fresh",
    },
    {
        "food_name": "Organic Whole Milk 1L",
        "category": "Dairy",
        "quantity": 4,
        "days_ago": 1,
        "expiry_days": 6,
        "location": "Cold Storage Bay A",
        "prediction": "fresh_milk",
        "confidence": 0.975,
        "status": "fresh",
    },
    {
        "food_name": "Artisan Sourdough Bread",
        "category": "Bread",
        "quantity": 2,
        "days_ago": 3,
        "expiry_days": 2,
        "location": "Pantry Storage 2",
        "prediction": "fresh_bread",
        "confidence": 0.952,
        "status": "fresh",
    },
    {
        "food_name": "Ripe Yellow Bananas",
        "category": "Fruits",
        "quantity": 8,
        "days_ago": 4,
        "expiry_days": 1,
        "location": "Fruit Basket 3",
        "prediction": "fresh_banana",
        "confidence": 0.961,
        "status": "fresh",
    },
    {
        "food_name": "Spoiled Bananas Batch",
        "category": "Fruits",
        "quantity": 5,
        "days_ago": 7,
        "expiry_days": -1,
        "location": "Waste Audit Bin 1",
        "prediction": "spoiled_banana",
        "confidence": 0.991,
        "status": "spoiled",
    },
    {
        "food_name": "Fresh Vine Tomatoes",
        "category": "Vegetables",
        "quantity": 12,
        "days_ago": 2,
        "expiry_days": 5,
        "location": "Chiller Bin B",
        "prediction": "fresh_tomato",
        "confidence": 0.968,
        "status": "fresh",
    },
    {
        "food_name": "Cheddar Cheese Block",
        "category": "Dairy",
        "quantity": 3,
        "days_ago": 5,
        "expiry_days": 12,
        "location": "Main Refrigerator Shelf 2",
        "prediction": "fresh_cheese",
        "confidence": 0.988,
        "status": "fresh",
    },
    {
        "food_name": "Fresh Salmon Fillets",
        "category": "Meat",
        "quantity": 6,
        "days_ago": 1,
        "expiry_days": 3,
        "location": "Freezer Vault 1",
        "prediction": "fresh_meat",
        "confidence": 0.971,
        "status": "fresh",
    },
    {
        "food_name": "Organic Spinach Pack",
        "category": "Vegetables",
        "quantity": 10,
        "days_ago": 3,
        "expiry_days": 1,
        "location": "Crisper Drawer 1",
        "prediction": "fresh_spinach",
        "confidence": 0.945,
        "status": "fresh",
    },
    {
        "food_name": "Spoiled Bread Slice",
        "category": "Bread",
        "quantity": 3,
        "days_ago": 8,
        "expiry_days": -2,
        "location": "Waste Audit Bin 2",
        "prediction": "spoiled_bread",
        "confidence": 0.983,
        "status": "spoiled",
    },
    {
        "food_name": "Fresh Navel Oranges",
        "category": "Fruits",
        "quantity": 20,
        "days_ago": 1,
        "expiry_days": 10,
        "location": "Main Refrigerator Shelf 3",
        "prediction": "fresh_orange",
        "confidence": 0.992,
        "status": "fresh",
    },
    {
        "food_name": "Greek Plain Yogurt",
        "category": "Dairy",
        "quantity": 8,
        "days_ago": 2,
        "expiry_days": 7,
        "location": "Cold Storage Bay A",
        "prediction": "fresh_yogurt",
        "confidence": 0.965,
        "status": "fresh",
    },
    {
        "food_name": "Spoiled Tomato Batch",
        "category": "Vegetables",
        "quantity": 4,
        "days_ago": 6,
        "expiry_days": 0,
        "location": "Chiller Bin C",
        "prediction": "spoiled_tomato",
        "confidence": 0.979,
        "status": "spoiled",
    },
    {
        "food_name": "Butter Croissants",
        "category": "Bread",
        "quantity": 6,
        "days_ago": 2,
        "expiry_days": 2,
        "location": "Pantry Storage 1",
        "prediction": "fresh_croissant",
        "confidence": 0.958,
        "status": "fresh",
    },
    {
        "food_name": "Chicken Breast Cutlets",
        "category": "Meat",
        "quantity": 8,
        "days_ago": 1,
        "expiry_days": 4,
        "location": "Freezer Vault 2",
        "prediction": "fresh_chicken",
        "confidence": 0.981,
        "status": "fresh",
    },
]


@router.post("/seed-demo", status_code=status.HTTP_201_CREATED)
def seed_demo_data(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> dict[str, Any]:
    """Seed enterprise demo inventory items, prediction logs, and notifications for the user."""
    today = datetime.utcnow().date()
    created_items_count = 0
    created_predictions_count = 0
    created_notifications_count = 0

    for item in DEMO_ITEMS:
        purchase_date = today - timedelta(days=item["days_ago"])
        expiry_date = today + timedelta(days=item["expiry_days"])

        temp_val = item.get("temp", 4.0 if item["status"] == "fresh" else 14.5)
        hum_val = item.get("humidity", 82.0 if item["status"] == "fresh" else 92.0)

        # 1. Create Inventory Record
        inventory_item = InventoryItem(
            user_id=current_user.id,
            food_name=item["food_name"],
            category=item["category"],
            quantity=item["quantity"],
            purchase_date=purchase_date,
            expiry_date=expiry_date,
            storage_location=item["location"],
            prediction=item["prediction"],
            confidence=item["confidence"],
            freshness_status=item["status"],
            storage_temperature=temp_val,
            storage_humidity=hum_val,
        )
        db.add(inventory_item)
        created_items_count += 1

        # 2. Create Prediction History Record
        history_record = PredictionHistory(
            user_id=current_user.id,
            image_path=f"demo_samples/{item['prediction']}.jpg",
            prediction=item["prediction"],
            confidence=item["confidence"],
            freshness_status=item["status"],
            created_at=datetime.utcnow() - timedelta(days=item["days_ago"]),
        )
        db.add(history_record)
        created_predictions_count += 1

        # 3. Create Notification for near-expiry or spoiled items
        if item["status"] == "spoiled" or item["expiry_days"] <= 2:
            noti_type = "spoiled_food_alert" if item["status"] == "spoiled" else "expiry_reminder"
            msg = (
                f"ALERT: Spoilage detected on {item['food_name']}!"
                if item["status"] == "spoiled"
                else f"REMINDER: {item['food_name']} expires in {item['expiry_days']} days."
            )
            notification = Notification(
                user_id=current_user.id,
                title="Critical Freshness Alert" if item["status"] == "spoiled" else "Expiration Reminder",
                message=msg,
                notification_type=noti_type,
                event_key=f"demo_seed_{uuid4().hex}",
                is_read=False,
                created_at=datetime.utcnow() - timedelta(days=item["days_ago"]),
            )
            db.add(notification)
            created_notifications_count += 1

    db.commit()

    return {
        "message": "Enterprise demo dataset successfully seeded!",
        "seeded_inventory": created_items_count,
        "seeded_predictions": created_predictions_count,
        "seeded_notifications": created_notifications_count,
    }


@router.delete("/clear-demo", status_code=status.HTTP_200_OK)
def clear_demo_data(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> dict[str, Any]:
    """Delete all demo seeded inventory, predictions, and notifications for the user."""
    # Delete user's inventory items
    deleted_inventory = (
        db.query(InventoryItem).filter(InventoryItem.user_id == current_user.id).delete(synchronize_session=False)
    )
    # Delete user's prediction history logs
    deleted_predictions = (
        db.query(PredictionHistory)
        .filter(PredictionHistory.user_id == current_user.id)
        .delete(synchronize_session=False)
    )
    # Delete user's notifications
    deleted_notifications = (
        db.query(Notification).filter(Notification.user_id == current_user.id).delete(synchronize_session=False)
    )

    db.commit()

    return {
        "message": "Demo data cleared successfully. System reset back to normal state!",
        "deleted_inventory": deleted_inventory,
        "deleted_predictions": deleted_predictions,
        "deleted_notifications": deleted_notifications,
    }

