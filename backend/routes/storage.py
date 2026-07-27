from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from ..database import get_db
from ..models import StorageLog, InventoryItem, Notification
from ..schemas import StorageLogCreate, StorageLogResponse
from ..auth import get_current_user, User

router = APIRouter(prefix="/api/storage", tags=["Storage Condition Monitoring"])

# Category storage rules
STORAGE_RULES = {
    "Fruits": {"temp_min": 0, "temp_max": 7, "hum_min": 85, "hum_max": 95, "light": "Medium", "air": "Good"},
    "Vegetables": {"temp_min": 0, "temp_max": 7, "hum_min": 90, "hum_max": 98, "light": "Low", "air": "Good"},
    "Dairy Products": {"temp_min": 1, "temp_max": 4, "hum_min": 75, "hum_max": 90, "light": "Low", "air": "Fair"},
    "Meat & Poultry": {"temp_min": -2, "temp_max": 2, "hum_min": 80, "hum_max": 90, "light": "Low", "air": "Good"},
    "Seafood": {"temp_min": -2, "temp_max": 0, "hum_min": 85, "hum_max": 95, "light": "Low", "air": "Good"},
    "Bakery Products": {"temp_min": 15, "temp_max": 22, "hum_min": 45, "hum_max": 55, "light": "Medium", "air": "Good"},
    "Packaged Foods": {"temp_min": 10, "temp_max": 25, "hum_min": 30, "hum_max": 50, "light": "Medium", "air": "Fair"},
    "Beverages": {"temp_min": 4, "temp_max": 15, "hum_min": 50, "hum_max": 70, "light": "Medium", "air": "Fair"}
}

@router.get("/logs", response_model=List[StorageLogResponse])
def get_storage_logs(limit: int = 50, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(StorageLog).order_by(StorageLog.logged_at.desc()).limit(limit).all()

@router.post("/logs", response_model=StorageLogResponse, status_code=status.HTTP_201_CREATED)
def log_storage_conditions(
    log_in: StorageLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only warehouse operators, inspectors, and admins can log conditions
    if current_user.role not in ["Warehouse Operator", "Food Quality Inspector", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to log storage conditions."
        )
        
    db_log = StorageLog(
        temperature=log_in.temperature,
        humidity=log_in.humidity,
        air_circulation=log_in.air_circulation,
        light_exposure=log_in.light_exposure
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    
    # Check compliance with current inventory items
    check_storage_compliance(db_log, db)
    
    # Update active inventory items' temp/humidity to match the new storage log readings
    active_items = db.query(InventoryItem).filter(InventoryItem.current_status != "Spoiled").all()
    for item in active_items:
        item.storage_temp = db_log.temperature
        item.humidity = db_log.humidity
    db.commit()
    
    return db_log

def check_storage_compliance(log: StorageLog, db: Session):
    # Get distinct categories of current active inventory items
    active_categories = db.query(InventoryItem.category).distinct().all()
    categories = [c[0] for c in active_categories if c[0] in STORAGE_RULES]
    
    for cat in categories:
        rules = STORAGE_RULES[cat]
        violations = []
        
        # Check Temp
        if log.temperature < rules["temp_min"]:
            violations.append(f"Temperature is too low ({log.temperature}°C). Minimum for {cat} is {rules['temp_min']}°C.")
        elif log.temperature > rules["temp_max"]:
            violations.append(f"Temperature is too high ({log.temperature}°C). Maximum for {cat} is {rules['temp_max']}°C.")
            
        # Check Humidity
        if log.humidity < rules["hum_min"]:
            violations.append(f"Humidity is too low ({log.humidity}%). Minimum for {cat} is {rules['hum_min']}%.")
        elif log.humidity > rules["hum_max"]:
            violations.append(f"Humidity is too high ({log.humidity}%). Maximum for {cat} is {rules['hum_max']}%.")
            
        if violations:
            # Check if alert already sent recently for this category to prevent spamming
            db_alert = Notification(
                title=f"Storage Non-Compliance: {cat}",
                message="; ".join(violations),
                type="Storage"
            )
            db.add(db_alert)
            
    db.commit()

@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Fetch latest log
    latest_log = db.query(StorageLog).order_by(StorageLog.logged_at.desc()).first()
    if not latest_log:
        return {"status": "No logs recorded yet", "recommendations": []}
        
    # Get distinct categories in stock
    active_items = db.query(InventoryItem).filter(InventoryItem.current_status != "Spoiled").all()
    if not active_items:
        return {
            "status": "No active stock",
            "recommendations": ["No inventory items currently registered. Clean and sanitize storage areas."]
        }
        
    categories_in_stock = list(set([item.category for item in active_items if item.category in STORAGE_RULES]))
    
    recommendations = []
    compliance_status = "Compliant"
    
    for cat in categories_in_stock:
        rules = STORAGE_RULES[cat]
        cat_recs = []
        
        # Temp check
        if latest_log.temperature > rules["temp_max"]:
            cat_recs.append(f"Cool down storage room for {cat}. Current: {latest_log.temperature}°C (Limit: {rules['temp_max']}°C).")
            compliance_status = "Warning"
        elif latest_log.temperature < rules["temp_min"]:
            cat_recs.append(f"Increase temperature slightly for {cat}. Current: {latest_log.temperature}°C (Limit: {rules['temp_min']}°C).")
            compliance_status = "Warning"
            
        # Humidity check
        if latest_log.humidity < rules["hum_min"]:
            cat_recs.append(f"Humidify storage space containing {cat}. Current: {latest_log.humidity}% (Optimal: {rules['hum_min']}-{rules['hum_max']}%).")
            compliance_status = "Warning"
        elif latest_log.humidity > rules["hum_max"]:
            cat_recs.append(f"Dehumidify storage space containing {cat}. Current: {latest_log.humidity}% (Optimal: {rules['hum_min']}-{rules['hum_max']}%).")
            compliance_status = "Warning"
            
        # Air check
        if latest_log.air_circulation == "Poor" and rules["air"] == "Good":
            cat_recs.append(f"Improve ventilation in {cat} storage section to prevent mold and spore buildup.")
            compliance_status = "Warning"
            
        # Light check
        if latest_log.light_exposure == "High" and rules["light"] == "Low":
            cat_recs.append(f"Dim lights or move {cat} to a dark container. Exposure is high (Optimal: Low).")
            compliance_status = "Warning"
            
        if cat_recs:
            recommendations.extend(cat_recs)
            
    if compliance_status == "Compliant":
        recommendations.append("All storage parameters are currently optimal for the stored inventory.")
        
    return {
        "status": compliance_status,
        "temperature": latest_log.temperature,
        "humidity": latest_log.humidity,
        "air_circulation": latest_log.air_circulation,
        "light_exposure": latest_log.light_exposure,
        "logged_at": latest_log.logged_at,
        "recommendations": list(set(recommendations))
    }
