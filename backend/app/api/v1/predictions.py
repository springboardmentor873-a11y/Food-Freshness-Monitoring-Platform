"""HTTP endpoint for AI food-freshness image predictions."""

from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.services.inference import InferenceError, predict_image
from app.services.preprocessing import ImageValidationError, SUPPORTED_CONTENT_TYPES
from app.core.dependencies import get_current_active_user
from app.database.models import User
from app.database.postgres import get_db
from app.services.history import PredictionHistoryService
from app.services.notifications import NotificationService
from app.services.shelf_life import ShelfLifeEngine
from app.services.recommendations import RecommendationEngine


router = APIRouter(prefix="/predict", tags=["Predictions"])


class PredictionResponse(BaseModel):
    """Serialized result of a food-freshness model prediction."""

    predicted_class: str = Field(
        description="Most likely class predicted by the EfficientNetB0 model"
    )
    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Probability assigned to the predicted class",
    )
    freshness_status: Literal["fresh", "spoiled"] = Field(
        description="Freshness grouping derived from the predicted class"
    )
    shelf_life_days: int = Field(ge=0, description="Estimated remaining shelf life in days")
    storage_recommendation: str
    consumption_recommendation: str
    food_safety_advice: str
    waste_reduction_advice: str


@router.post(
    "",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict food freshness from an image",
    responses={
        status.HTTP_415_UNSUPPORTED_MEDIA_TYPE: {
            "description": "The uploaded file is not a supported image type"
        },
        status.HTTP_422_UNPROCESSABLE_CONTENT: {
            "description": "The uploaded file is corrupt, empty, or unsafe"
        },
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "The prediction model is unavailable"
        },
    },
)
async def create_prediction(
    image: Annotated[UploadFile, File(description="JPEG, PNG, or WEBP food image")],
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[Session, Depends(get_db)],
) -> PredictionResponse:
    """Validate an uploaded image and return its AI freshness prediction."""
    if image.content_type not in SUPPORTED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPEG, PNG, and WEBP images are supported",
        )

    try:
        prediction = await predict_image(image)
        history = await PredictionHistoryService(db).record(current_user, image, prediction)
        NotificationService(db).create_prediction_notifications(current_user, history)
    except ImageValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=str(exc),
        ) from exc

    except InferenceError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction service is currently unavailable",
        ) from exc
    finally:
        await image.close()

    freshness_status: Literal["fresh", "spoiled"] = (
        "fresh" if prediction.predicted_class.startswith("fresh_") else "spoiled"
    )
    shelf_life = ShelfLifeEngine.from_settings().assess(prediction.predicted_class)
    recommendation = RecommendationEngine().generate(prediction.predicted_class)
    return PredictionResponse(
        predicted_class=prediction.predicted_class,
        confidence=prediction.confidence,
        freshness_status=freshness_status,
        shelf_life_days=shelf_life.shelf_life_days,
        storage_recommendation=recommendation.storage_advice,
        consumption_recommendation=recommendation.consumption_advice,
        food_safety_advice=recommendation.food_safety_advice,
        waste_reduction_advice=recommendation.waste_reduction_advice,
    )
