import os
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.core.config import settings
from app.core.security import get_current_user
from app.services.image_analysis import analyze_image
from app.services.storage_scoring import score_storage_conditions
from app.services.shelf_life import predict_shelf_life
from app.services.scoring import compute_overall_score, categorize
from app.services.recommendations import build_recommendations

router = APIRouter(prefix="/api/freshness", tags=["Freshness Assessment"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("/assess/{food_item_id}", response_model=schemas.FreshnessAssessmentOut, status_code=201)
async def assess_food_item(
    food_item_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.FoodItem).filter(models.FoodItem.id == food_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found.")

    ext = os.path.splitext(image.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type '{ext}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}",
        )

    os.makedirs(settings.upload_dir, exist_ok=True)
    saved_name = f"{uuid.uuid4().hex}{ext}"
    saved_path = os.path.join(settings.upload_dir, saved_name)

    contents = await image.read()
    if len(contents) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image exceeds maximum upload size.")
    with open(saved_path, "wb") as f:
        f.write(contents)

    # 1. Image analysis
    try:
        img_result = analyze_image(saved_path)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # 2. Storage condition scoring
    storage_result = score_storage_conditions(
        item.category, item.storage_temperature_c, item.storage_humidity_pct
    )

    # 3. Shelf-life prediction
    age_days = (datetime.utcnow() - item.received_date).total_seconds() / 86400.0
    shelf_result = predict_shelf_life(
        item.category,
        age_days=age_days,
        storage_condition_score=storage_result.storage_condition_score,
        visual_condition_score=img_result.visual_condition_score,
    )

    # 4. Weighted overall freshness score
    overall_score = compute_overall_score(
        visual_condition_score=img_result.visual_condition_score,
        storage_condition_score=storage_result.storage_condition_score,
        shelf_life_score=shelf_result.shelf_life_score,
        product_age_score=shelf_result.product_age_score,
    )
    category = categorize(overall_score)

    # 5. Recommendations
    recs = build_recommendations(
        category, img_result, storage_result, shelf_result.predicted_remaining_shelf_life_days
    )

    assessment = models.FreshnessAssessment(
        food_item_id=item.id,
        image_path=saved_path,
        color_score=img_result.color_score,
        texture_score=img_result.texture_score,
        mold_risk_score=img_result.mold_risk_score,
        bruising_risk_score=img_result.bruising_risk_score,
        visual_condition_score=img_result.visual_condition_score,
        storage_condition_score=storage_result.storage_condition_score,
        shelf_life_score=shelf_result.shelf_life_score,
        product_age_score=shelf_result.product_age_score,
        overall_freshness_score=overall_score,
        freshness_category=category,
        predicted_remaining_shelf_life_days=shelf_result.predicted_remaining_shelf_life_days,
        spoilage_probability=shelf_result.spoilage_probability,
        recommendations="\n".join(recs),
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


@router.get("/item/{food_item_id}", response_model=list[schemas.FreshnessAssessmentOut])
def list_assessments_for_item(
    food_item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.FreshnessAssessment)
        .filter(models.FreshnessAssessment.food_item_id == food_item_id)
        .order_by(models.FreshnessAssessment.created_at.desc())
        .all()
    )
