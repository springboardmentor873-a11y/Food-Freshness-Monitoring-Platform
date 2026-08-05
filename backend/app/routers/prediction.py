from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.prediction import PredictionResponse, PredictionListItem
from app.services.prediction_service import (
    run_image_prediction,
    get_predictions_history,
    get_prediction_detail,
    delete_prediction_record,
)
from app.utils.deps import get_optional_current_user, get_current_user
from app.models.user import User

router = APIRouter(tags=["AI Prediction Engine"])

@router.post("/predict", response_model=PredictionResponse)
@router.post("/api/predict", response_model=PredictionResponse)
@router.post("/api/analysis/predict", response_model=PredictionResponse)
async def predict_food_freshness(
    file: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    upload_file = file or image
    if not upload_file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image file required for prediction"
        )
    user_id = current_user.id if current_user else None
    return run_image_prediction(db, upload_file, user_id=user_id)

@router.get("/predictions")
@router.get("/api/predictions")
def list_predictions(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else None
    return get_predictions_history(db, user_id=user_id)

@router.get("/prediction/{prediction_id}")
@router.get("/api/prediction/{prediction_id}")
def get_prediction(
    prediction_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else None
    return get_prediction_detail(db, prediction_id, user_id=user_id)

@router.delete("/prediction/{prediction_id}")
@router.delete("/api/prediction/{prediction_id}")
def delete_prediction(
    prediction_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    user_id = current_user.id if current_user else None
    return delete_prediction_record(db, prediction_id, user_id=user_id)
