"""Validation and EfficientNetB0 preprocessing for uploaded food images."""

from __future__ import annotations

import warnings
from io import BytesIO

import numpy as np
import tensorflow as tf
from fastapi import UploadFile
from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.config import settings


MODEL_INPUT_SIZE = (224, 224)
SUPPORTED_IMAGE_FORMATS = frozenset({"JPEG", "PNG", "WEBP"})
SUPPORTED_CONTENT_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})
MAX_IMAGE_PIXELS = 50_000_000


class ImageValidationError(ValueError):
    """Raised when an uploaded file is not a safe, supported image."""


async def preprocess_upload(image: UploadFile) -> tf.Tensor:
    """Validate an uploaded image and return an EfficientNetB0-ready batch tensor.

    The returned tensor has shape ``(1, 224, 224, 3)``. EfficientNet's official
    preprocessing function is used so its expected input scaling is preserved.
    """
    _validate_declared_content_type(image)

    payload = await image.read(settings.MAX_UPLOAD_SIZE_BYTES + 1)
    await image.seek(0)
    if not payload:
        raise ImageValidationError("The uploaded image is empty")
    if len(payload) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise ImageValidationError(
            f"Image exceeds the {settings.MAX_UPLOAD_SIZE_BYTES} byte upload limit"
        )

    rgb_image = _decode_image(payload)
    resized_image = rgb_image.resize(MODEL_INPUT_SIZE, Image.Resampling.LANCZOS)
    image_array = np.asarray(resized_image, dtype=np.float32)
    batch = tf.expand_dims(tf.convert_to_tensor(image_array), axis=0)
    return tf.keras.applications.efficientnet.preprocess_input(batch)


def _validate_declared_content_type(image: UploadFile) -> None:
    """Reject explicit MIME types outside the supported raster image formats."""
    if image.content_type and image.content_type.lower() not in SUPPORTED_CONTENT_TYPES:
        raise ImageValidationError("Only JPEG, PNG, and WEBP images are supported")


def _decode_image(payload: bytes) -> Image.Image:
    """Verify, decode, orient, and convert a supported image to RGB."""
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(payload)) as source_image:
                source_image.verify()

            with Image.open(BytesIO(payload)) as source_image:
                if source_image.format not in SUPPORTED_IMAGE_FORMATS:
                    raise ImageValidationError("Only JPEG, PNG, and WEBP images are supported")
                if source_image.width * source_image.height > MAX_IMAGE_PIXELS:
                    raise ImageValidationError("Image dimensions exceed the allowed limit")
                return ImageOps.exif_transpose(source_image).convert("RGB")
    except ImageValidationError:
        raise
    except (
        Image.DecompressionBombError,
        Image.DecompressionBombWarning,
        OSError,
        UnidentifiedImageError,
        ValueError,
    ) as exc:
        raise ImageValidationError("The uploaded file is not a valid image") from exc
