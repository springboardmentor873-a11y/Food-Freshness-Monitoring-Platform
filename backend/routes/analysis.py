import os
import time
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import AnalysisHistory, InventoryItem, Notification
from ..schemas import AnalysisResponse
from ..auth import get_current_user, User
from ..ml_engine import run_inference

router = APIRouter(prefix="/api/analysis", tags=["Image Analysis Engine"])

UPLOAD_DIR = r"d:\foodfreshness\backend\uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/scan", response_model=AnalysisResponse)
async def scan_food_image(
    file: UploadFile = File(...),
    item_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File uploaded must be an image."
        )
        
    # Generate unique filename
    filename = f"{int(time.time())}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save uploaded file: {e}"
        )
        
    # Run model inference and computer-vision analysis
    try:
        report = run_inference(file_path)
    except Exception as e:
        # Clean up file on failure
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model inference failed: {e}"
        )
        
    # Save to database
    image_url = f"/uploads/{filename}"
    
    db_analysis = AnalysisHistory(
        item_id=item_id,
        image_url=image_url,
        category=report["category"],
        freshness_score=report["freshness_score"],
        quality_class=report["quality_class"],
        spoilage_prob=report["spoilage_prob"],
        color_degradation=report["color_degradation"],
        texture_change=report["texture_change"],
        mold_detected=report["mold_detected"],
        bruising_detected=report["bruising_detected"],
        physical_damage_detected=report["physical_damage_detected"]
    )
    
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    
    # If linked to an inventory item, update it
    if item_id:
        item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
        if item:
            item.current_status = report["quality_class"]
            # Let the recalculation take place
            db.commit()
            
    # Trigger notifications based on analysis result
    if report["mold_detected"] or report["quality_class"] in ["Near Spoilage", "Spoiled"]:
        alert_title = f"Spoilage Alert: {report['category'].replace('_', ' ').title()}"
        alert_msg = f"Visual analysis detected {report['quality_class'].lower()} quality for {report['category']} with {report['freshness_score']}% freshness. Mold: {report['mold_detected']}, Bruising: {report['bruising_detected']}."
        
        db_alert = Notification(
            title=alert_title,
            message=alert_msg,
            type="Spoilage" if report["quality_class"] == "Spoiled" or report["mold_detected"] else "Freshness"
        )
        db.add(db_alert)
        db.commit()
        
    return db_analysis

import io
import csv
from fastapi.responses import StreamingResponse

@router.get("/export")
def export_analysis_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(AnalysisHistory).order_by(AnalysisHistory.analyzed_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write headers
    writer.writerow([
        "Analysis ID", "Item ID", "Category", "Freshness Score (%)", 
        "Quality Class", "Spoilage Probability", "Color Degradation", 
        "Texture Change", "Mold Detected", "Bruising Detected", 
        "Physical Damage", "Analyzed At"
    ])
    
    # Write rows
    for run in history:
        writer.writerow([
            run.id,
            run.item_id if run.item_id is not None else "Unlinked",
            run.category or "Unknown",
            run.freshness_score,
            run.quality_class,
            run.spoilage_prob,
            run.color_degradation,
            run.texture_change,
            run.mold_detected,
            run.bruising_detected,
            run.physical_damage_detected,
            run.analyzed_at.strftime("%Y-%m-%d %H:%M:%S")
        ])
        
    output.seek(0)
    
    # Write local copy to workspace for convenient user access
    try:
        import os
        exports_dir = "d:/foodfreshness/exports"
        os.makedirs(exports_dir, exist_ok=True)
        with open(os.path.join(exports_dir, "freshness_analysis_report.csv"), "w", encoding="utf-8") as f:
            f.write(output.getvalue())
    except Exception as e:
        print(f"[Export Local Write Error]: {e}")

    response = StreamingResponse(io.BytesIO(output.getvalue().encode("utf-8")), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=freshness_analysis_report.csv"
    return response

@router.get("/history", response_model=List[AnalysisResponse])
def get_analysis_history(
    item_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(AnalysisHistory)
    if item_id:
        query = query.filter(AnalysisHistory.item_id == item_id)
    return query.order_by(AnalysisHistory.analyzed_at.desc()).all()
