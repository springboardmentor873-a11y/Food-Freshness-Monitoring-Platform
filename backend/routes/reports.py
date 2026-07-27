import io
import csv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from ..database import get_db
from ..models import InventoryItem, AnalysisHistory
from ..auth import get_current_user, User

router = APIRouter(prefix="/api/reports", tags=["Reports & Export System"])

@router.get("/summary")
def get_report_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Total items
    items = db.query(InventoryItem).all()
    total_count = len(items)
    
    # 2. Count by status
    status_counts = {"Fresh": 0, "Good": 0, "Acceptable": 0, "Near Spoilage": 0, "Spoiled": 0}
    for item in items:
        status_counts[item.current_status] = status_counts.get(item.current_status, 0) + 1
        
    # 3. Average freshness score
    # We will fetch latest analysis freshness scores or calculate estimated scores
    scores = []
    category_scores = {}
    
    for item in items:
        # Determine latest score (this mimics our update_item_freshness_dynamically logic)
        latest_analysis = db.query(AnalysisHistory).filter(AnalysisHistory.item_id == item.id).order_by(AnalysisHistory.analyzed_at.desc()).first()
        if latest_analysis:
            score = latest_analysis.freshness_score
        else:
            # Fallback estimation
            now = datetime.utcnow()
            total_life = (item.expiry_date - item.registered_at).total_seconds()
            elapsed = (now - item.registered_at).total_seconds()
            ratio = min(max(elapsed / total_life if total_life > 0 else 1.0, 0.0), 1.0)
            score = 100.0 * (1.0 - ratio)
            
        scores.append(score)
        category_scores[item.category] = category_scores.get(item.category, []) + [score]
        
    avg_freshness = sum(scores) / len(scores) if scores else 100.0
    
    # Category averages
    category_averages = {}
    for cat, cat_scores in category_scores.items():
        category_averages[cat] = round(sum(cat_scores) / len(cat_scores), 1)
        
    # 4. Spoilage and waste reduction metrics
    # Waste reduction rate = (Items consumed or still fresh / Total items)
    spoiled_count = status_counts.get("Spoiled", 0)
    waste_rate = (spoiled_count / total_count * 100.0) if total_count > 0 else 0.0
    waste_reduction_efficiency = 100.0 - waste_rate
    
    return {
        "total_items": total_count,
        "average_freshness": round(avg_freshness, 1),
        "status_distribution": status_counts,
        "category_averages": category_averages,
        "waste_reduction_efficiency_percent": round(waste_reduction_efficiency, 1),
        "total_spoilage_count": spoiled_count
    }

@router.get("/export")
def export_inventory_report(format: str = "csv", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(InventoryItem).all()
    
    if format.lower() == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write CSV headers
        writer.writerow([
            "Item ID", "Name", "Category", "Batch Number", "Quantity", 
            "Registration Date", "Expiry Date", "Storage Temp (°C)", 
            "Humidity (%)", "Packaging Type", "Current Status"
        ])
        
        # Write rows
        for item in items:
            writer.writerow([
                item.id,
                item.name,
                item.category,
                item.batch_number or "N/A",
                item.quantity,
                item.registered_at.strftime("%Y-%m-%d %H:%M:%S"),
                item.expiry_date.strftime("%Y-%m-%d %H:%M:%S"),
                item.storage_temp if item.storage_temp is not None else "N/A",
                item.humidity if item.humidity is not None else "N/A",
                item.packaging_type or "N/A",
                item.current_status
            ])
            
        output.seek(0)
        
        # Write local copy to workspace for convenient user access
        try:
            import os
            exports_dir = "d:/foodfreshness/exports"
            os.makedirs(exports_dir, exist_ok=True)
            with open(os.path.join(exports_dir, "food_freshness_report.csv"), "w", encoding="utf-8") as f:
                f.write(output.getvalue())
        except Exception as e:
            print(f"[Export Local Write Error]: {e}")

        response = StreamingResponse(io.BytesIO(output.getvalue().encode("utf-8")), media_type="text/csv")
        response.headers["Content-Disposition"] = "attachment; filename=food_freshness_report.csv"
        return response
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported export format. Supported formats: csv"
        )
