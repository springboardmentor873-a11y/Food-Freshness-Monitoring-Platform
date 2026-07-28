"""EfficientNetB0 inference service for uploaded food images."""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass

import numpy as np
import tensorflow as tf
from fastapi import UploadFile

from app.services.model_loader import ModelLoadError, get_model
from app.services.preprocessing import ImageValidationError, preprocess_upload


logger = logging.getLogger(__name__)

CLASS_NAMES = (
    "fresh_bread",
    "fresh_dairy",
    "fresh_fruits",
    "fresh_vegetables",
    "spoiled_bread",
    "spoiled_dairy",
    "spoiled_fruits",
    "spoiled_vegetables",
)


class InferenceError(RuntimeError):
    """Raised when a model prediction cannot be completed safely."""


@dataclass(frozen=True, slots=True)
class InferenceResult:
    """The highest-confidence class predicted by the freshness model."""

    predicted_class: str
    confidence: float


async def predict_image(image: UploadFile) -> InferenceResult:
    """Preprocess an upload and return its EfficientNetB0 prediction.

    Raises:
        ImageValidationError: If the uploaded image is invalid or unsupported.
        InferenceError: If the model is unavailable or inference fails.
    """
    tensor = await preprocess_upload(image)
    try:
        model = get_model()
        predictions = await asyncio.to_thread(_run_prediction, model, tensor)
        probabilities = _to_probabilities(predictions)
    except ImageValidationError:
        raise
    except ModelLoadError as exc:
        logger.exception("Food-freshness model is unavailable")
        raise InferenceError("The prediction model is currently unavailable") from exc
    except Exception as exc:
        logger.exception("Food-freshness inference failed")
        raise InferenceError("Unable to complete image prediction") from exc

    predicted_index = int(np.argmax(probabilities))
    return InferenceResult(
        predicted_class=CLASS_NAMES[predicted_index],
        confidence=float(probabilities[predicted_index]),
    )


def _run_prediction(model: tf.keras.Model, tensor: tf.Tensor) -> np.ndarray:
    """Execute the synchronous Keras prediction call outside the event loop."""
    return np.asarray(model.predict(tensor, verbose=0))


def _to_probabilities(predictions: np.ndarray) -> np.ndarray:
    """Validate the model output and return one probability vector."""
    if predictions.ndim != 2 or predictions.shape[0] != 1:
        raise ValueError("Model must return a single batch of class predictions")
    if predictions.shape[1] != len(CLASS_NAMES):
        raise ValueError("Model output does not match the configured class labels")

    scores = predictions[0].astype(np.float64)
    if not np.all(np.isfinite(scores)):
        raise ValueError("Model returned non-finite prediction scores")

    if np.all(scores >= 0) and np.isclose(scores.sum(), 1.0, rtol=1e-4, atol=1e-6):
        return scores

    shifted_scores = scores - np.max(scores)
    exponentials = np.exp(shifted_scores)
    return exponentials / exponentials.sum()
