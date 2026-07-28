"""HTTP endpoint for AI food-freshness image predictions."""

from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from pydantic import BaseModel, Field

from app.services.inference import InferenceError, predict_image
from app.services.preprocessing import ImageValidationError, SUPPORTED_CONTENT_TYPES


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


@router.post(
    "",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict food freshness from an image",
    responses={
        status.HTTP_415_UNSUPPORTED_MEDIA_TYPE: {
            "description": "The uploaded file is not a supported image type"
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "The uploaded file is corrupt, empty, or unsafe"
        },
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "The prediction model is unavailable"
        },
    },
)
async def create_prediction(
    image: Annotated[UploadFile, File(description="JPEG, PNG, or WEBP food image")],
) -> PredictionResponse:
    """Validate an uploaded image and return its AI freshness prediction."""
    if image.content_type not in SUPPORTED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only JPEG, PNG, and WEBP images are supported",
        )

    try:
        prediction = await predict_image(image)
    except ImageValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
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
    return PredictionResponse(
        predicted_class=prediction.predicted_class,
        confidence=prediction.confidence,
        freshness_status=freshness_status,
    )
