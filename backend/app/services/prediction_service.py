import os
import json
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status
from app.config import settings
from app.models.prediction import Prediction
from app.models.search_history import SearchHistory
from app.models.notification import Notification
from app.utils.model_loader import model_manager
from app.utils.shelf_life import generate_freshness_insights

def run_image_prediction(db: Session, file: UploadFile, user_id: Optional[int] = None) -> Dict[str, Any]:
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in [".jpg", ".jpeg", ".png", ".webp", ".bmp"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported image format. Upload JPG, PNG, WEBP or BMP."
        )

    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(saved_path, "wb") as f:
        f.write(file.file.read())

    # Run inference using EfficientNetB0
    predicted_class, confidence, probabilities, pred_time_ms = model_manager.predict(saved_path)

    # Generate insights
    insights = generate_freshness_insights(predicted_class, confidence)

    pred_id = f"pred-{uuid.uuid4().hex[:12]}"
    preview_url = f"/uploads/{unique_filename}"

    # Database model creation
    prediction_record = Prediction(
        id=pred_id,
        user_id=user_id,
        item_name=insights["itemName"],
        category=insights["category"],
        preview_url=preview_url,
        freshness_score=insights["freshnessScore"],
        freshness_category=insights["freshnessCategory"],
        confidence=confidence,
        shelf_life_days=insights["shelfLifeDays"],
        health_score=insights["healthScore"],
        issues_json=json.dumps(insights["issues"]),
        storage_json=json.dumps(insights["storage"]),
        predicted_class=predicted_class,
        raw_probabilities_json=json.dumps(probabilities),
        prediction_time_ms=pred_time_ms,
        analyzed_at=datetime.utcnow()
    )

    db.add(prediction_record)

    # Log into search history
    search_record = SearchHistory(
        user_id=user_id,
        food_name=insights["itemName"],
        prediction_status=insights["freshnessCategory"],
        category=insights["category"],
        searched_at=datetime.utcnow()
    )
    db.add(search_record)

    # Automatic notification generation
    if insights["freshnessCategory"] in ["Spoiled", "Near Spoilage"]:
        notification = Notification(
            user_id=user_id,
            title="⚠️ Spoilage Alert Detected",
            message=f"Analyzed '{insights['itemName']}' exhibits spoilage indicators (Freshness: {insights['freshnessScore']}%). Consume immediately or discard safely.",
            type="spoilage",
            is_read=False,
            created_at=datetime.utcnow()
        )
        db.add(notification)

    db.commit()
    db.refresh(prediction_record)

    return {
        "id": prediction_record.id,
        "itemName": prediction_record.item_name,
        "category": prediction_record.category,
        "previewUrl": prediction_record.preview_url,
        "analyzedAt": prediction_record.analyzed_at.isoformat(),
        "freshnessScore": prediction_record.freshness_score,
        "freshnessCategory": prediction_record.freshness_category,
        "confidence": prediction_record.confidence,
        "shelfLifeDays": prediction_record.shelf_life_days,
        "healthScore": prediction_record.health_score,
        "issues": json.loads(prediction_record.issues_json or "[]"),
        "storage": json.loads(prediction_record.storage_json or "{}"),
        "predictionTime": prediction_record.prediction_time_ms
    }

def get_predictions_history(db: Session, user_id: Optional[int] = None, limit: int = 50) -> List[Dict[str, Any]]:
    query = db.query(Prediction)
    if user_id:
        query = query.filter(Prediction.user_id == user_id)
    predictions = query.order_by(Prediction.analyzed_at.desc()).limit(limit).all()

    results = []
    for p in predictions:
        results.append({
            "id": p.id,
            "itemName": p.item_name,
            "category": p.category,
            "previewUrl": p.preview_url,
            "freshnessScore": p.freshness_score,
            "freshnessCategory": p.freshness_category,
            "confidence": p.confidence,
            "shelfLifeDays": p.shelf_life_days,
            "healthScore": p.health_score,
            "analyzedAt": p.analyzed_at.isoformat()
        })
    return results

def get_prediction_detail(db: Session, pred_id: str, user_id: Optional[int] = None) -> Dict[str, Any]:
    query = db.query(Prediction).filter(Prediction.id == pred_id)
    if user_id:
        query = query.filter(Prediction.user_id == user_id)
    p = query.first()

    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction record not found")

    return {
        "id": p.id,
        "itemName": p.item_name,
        "category": p.category,
        "previewUrl": p.preview_url,
        "analyzedAt": p.analyzed_at.isoformat(),
        "freshnessScore": p.freshness_score,
        "freshnessCategory": p.freshness_category,
        "confidence": p.confidence,
        "shelfLifeDays": p.shelf_life_days,
        "healthScore": p.health_score,
        "issues": json.loads(p.issues_json or "[]"),
        "storage": json.loads(p.storage_json or "{}"),
        "predictionTime": p.prediction_time_ms
    }

def delete_prediction_record(db: Session, pred_id: str, user_id: Optional[int] = None):
    query = db.query(Prediction).filter(Prediction.id == pred_id)
    if user_id:
        query = query.filter(Prediction.user_id == user_id)
    p = query.first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found")

    db.delete(p)
    db.commit()
    return {"message": "Prediction record deleted successfully"}
