"""Singleton loader for the trained food-freshness Keras model."""

from __future__ import annotations

import logging
from pathlib import Path
from threading import Lock

from tensorflow import keras

from app.core.config import settings


logger = logging.getLogger(__name__)

_model: keras.Model | None = None
_model_lock = Lock()
_backend_root = Path(__file__).resolve().parents[2]


class ModelLoadError(RuntimeError):
    """Raised when the configured Keras model cannot be loaded."""


def get_model() -> keras.Model:
    """Load the configured model once and return the cached instance.

    Raises:
        ModelLoadError: If the model file is missing or Keras cannot load it.
    """
    global _model

    if _model is not None:
        return _model

    with _model_lock:
        if _model is not None:
            return _model

        model_path = _resolve_model_path(settings.MODEL_PATH)
        if not model_path.is_file():
            raise ModelLoadError(f"Model file was not found: {model_path}")

        try:
            _model = keras.models.load_model(model_path, compile=False)
        except (OSError, ValueError, TypeError) as exc:
            logger.exception("Unable to load food-freshness model")
            raise ModelLoadError(f"Failed to load model from: {model_path}") from exc

        logger.info("Loaded food-freshness model from %s", model_path)
        return _model


def _resolve_model_path(configured_path: str) -> Path:
    """Resolve relative model paths against the backend directory."""
    path = Path(configured_path).expanduser()
    return path if path.is_absolute() else _backend_root / path
