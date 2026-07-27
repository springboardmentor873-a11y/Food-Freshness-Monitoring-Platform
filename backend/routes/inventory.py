from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from ..database import get_db
from ..models import InventoryItem, AnalysisHistory, Notification
from ..schemas import InventoryCreate, InventoryResponse, InventoryUpdate
from ..auth import get_current_user, RoleChecker, User

router = APIRouter(prefix="/api/inventory", tags=["Inventory Management"])

# Optimal storage temperature and humidity by category
OPTIMAL_CONDITIONS = {
    "Fruits": {"temp": 4.0, "humidity": 90.0, "max_days": 14},
    "Vegetables": {"temp": 4.0, "humidity": 95.0, "max_days": 10},
    "Dairy Products": {"temp": 2.0, "humidity": 85.0, "max_days": 12},
    "Meat & Poultry": {"temp": 0.0, "humidity": 85.0, "max_days": 7},
    "Seafood": {"temp": -1.0, "humidity": 90.0, "max_days": 5},
    "Bakery Products": {"temp": 20.0, "humidity": 50.0, "max_days": 6},
    "Packaged Foods": {"temp": 20.0, "humidity": 40.0, "max_days": 180},
    "Beverages": {"temp": 8.0, "humidity": 60.0, "max_days": 90}
}

def update_item_freshness_dynamically(item: InventoryItem, db: Session):
    """
    Dynamically recalculates freshness score and status based on elapsed time, 
    expiry date, and storage condition logs.
    """
    now = datetime.utcnow()
    total_life_delta = item.expiry_date - item.registered_at
    total_life_seconds = max(total_life_delta.total_seconds(), 1.0)
    
    elapsed_delta = now - item.registered_at
    elapsed_seconds = max(elapsed_delta.total_seconds(), 0.0)
    
    # 1. Base age ratio
    age_ratio = min(elapsed_seconds / total_life_seconds, 1.0)
    
    # 2. Storage conditions impact
    category_limits = OPTIMAL_CONDITIONS.get(item.category, {"temp": 4.0, "humidity": 80.0})
    optimal_temp = category_limits["temp"]
    
    temp_factor = 1.0
    if item.storage_temp is not None:
        temp_diff = item.storage_temp - optimal_temp
        if temp_diff > 0:
            # Decay rate increases by 15% per degree above optimal
            temp_factor = 1.0 + (temp_diff * 0.15)
            
    # Adjusted age ratio accounting for accelerated decay
    effective_age_ratio = min(age_ratio * temp_factor, 1.0)
    
    # 3. Check if we have a visual analysis score
    latest_analysis = db.query(AnalysisHistory).filter(AnalysisHistory.item_id == item.id).order_by(AnalysisHistory.analyzed_at.desc()).first()
    
    if latest_analysis:
        visual_score = latest_analysis.freshness_score
    else:
        visual_score = 100.0 * (1.0 - effective_age_ratio)
        
    # Recalculate freshness score using weighted model from project plan:
    # Freshness Score = Visual Analysis (40%) + Storage Conditions (25%) + Shelf-Life Prediction (20%) + Product Age (15%)
    # Let's map these:
    # - Visual Analysis Score (0-100)
    # - Storage Condition Score: 100 * (1 / temp_factor)
    # - Shelf-Life Prediction: 100 * (1 - effective_age_ratio)
    # - Product Age Score: 100 * (1 - age_ratio)
    
    storage_score = 100.0 * (1.0 / temp_factor)
    shelf_life_pred_score = 100.0 * (1.0 - effective_age_ratio)
    age_score = 100.0 * (1.0 - age_ratio)
    
    new_freshness_score = (
        (visual_score * 0.40) + 
        (storage_score * 0.25) + 
        (shelf_life_pred_score * 0.20) + 
        (age_score * 0.15)
    )
    
    new_freshness_score = min(max(new_freshness_score, 0.0), 100.0)
    
    # Determine new status
    if now >= item.expiry_date or new_freshness_score < 15:
        new_status = "Spoiled"
    elif new_freshness_score < 35:
        new_status = "Near Spoilage"
    elif new_freshness_score < 60:
        new_status = "Acceptable"
    elif new_freshness_score < 80:
        new_status = "Good"
    else:
        new_status = "Fresh"
        
    # Trigger alert if status changed to critical
    if new_status in ["Near Spoilage", "Spoiled"] and item.current_status not in ["Near Spoilage", "Spoiled"]:
        alert_title = f"{new_status} Warning: {item.name}"
        alert_msg = f"Item '{item.name}' (Batch: {item.batch_number}) has reached '{new_status}' status. Freshness score is {new_freshness_score:.1f}%."
        db_alert = Notification(
            title=alert_title,
            message=alert_msg,
            type="Spoilage" if new_status == "Spoiled" else "Shelf-Life"
        )
        db.add(db_alert)
        
    item.current_status = new_status
    db.commit()

@router.get("", response_model=List[InventoryResponse])
def get_inventory(category: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(InventoryItem)
    if category:
        query = query.filter(InventoryItem.category == category)
        
    items = query.all()
    
    # Dynamically update status for all items on fetch
    for item in items:
        update_item_freshness_dynamically(item, db)
        
    return items

@router.get("/{item_id}", response_model=InventoryResponse)
def get_inventory_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    update_item_freshness_dynamically(item, db)
    return item

@router.post("", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(item_in: InventoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Role-based restriction: Only managers, inspectors, and admins can add items
    if current_user.role not in ["Retail Manager", "Warehouse Operator", "Food Quality Inspector", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to register new inventory items."
        )
        
    db_item = InventoryItem(
        name=item_in.name,
        category=item_in.category,
        batch_number=item_in.batch_number,
        quantity=item_in.quantity,
        expiry_date=item_in.expiry_date,
        storage_temp=item_in.storage_temp,
        humidity=item_in.humidity,
        packaging_type=item_in.packaging_type,
        current_status="Fresh"
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # Generate registration log notice
    db_alert = Notification(
        title="New Item Registered",
        message=f"Registered {db_item.name} under category {db_item.category}. Expiry date set to {db_item.expiry_date.strftime('%Y-%m-%d')}.",
        type="Inventory"
    )
    db.add(db_alert)
    db.commit()
    
    # Recalculate status
    update_item_freshness_dynamically(db_item, db)
    db.refresh(db_item)
    return db_item

@router.put("/{item_id}", response_model=InventoryResponse)
def update_inventory_item(item_id: int, item_in: InventoryUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
        
    # Role-based restriction
    if current_user.role not in ["Retail Manager", "Warehouse Operator", "Food Quality Inspector", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit inventory."
        )
        
    update_data = item_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
        
    db.commit()
    update_item_freshness_dynamically(item, db)
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
        
    if current_user.role not in ["Retail Manager", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Managers and Admins can delete inventory items."
        )
        
    db.delete(item)
    db.commit()
    return None
