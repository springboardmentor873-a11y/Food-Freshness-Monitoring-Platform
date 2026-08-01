from fastapi import UploadFile
from PIL import Image
import numpy as np
from app.models import ImageAssessment
from app.ml.image_model import load_image_model, predict_image

model = load_image_model()


def analyze_image(file: UploadFile) -> ImageAssessment:
    image = Image.open(file.file)
    image = image.convert("RGB")

    if model is not None:
        label, score = predict_image(image, model)
        freshness_score = float(score)
        freshness_label = "Fresh" if label == "fresh" else "Spoiled"
        return ImageAssessment(
            image_filename=file.filename,
            freshness_score=freshness_score,
            freshness_label=freshness_label,
            spoilage_probability=1.0 - freshness_score,
        )

    pixels = np.array(image)
    avg_color = pixels.mean(axis=(0, 1))
    brightness = avg_color.mean()
    freshness_score = float(max(0.0, min(1.0, brightness / 255.0)))
    if freshness_score > 0.8:
        label = "Fresh"
    elif freshness_score > 0.6:
        label = "Good"
    elif freshness_score > 0.4:
        label = "Acceptable"
    elif freshness_score > 0.2:
        label = "Near Spoilage"
    else:
        label = "Spoiled"

    return ImageAssessment(
        image_filename=file.filename,
        freshness_score=freshness_score,
        freshness_label=label,
        spoilage_probability=1.0 - freshness_score,
    )
