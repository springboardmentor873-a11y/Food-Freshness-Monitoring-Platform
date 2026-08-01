import os
import joblib
from pathlib import Path
from app.models import ShelfLifeRequest

MODEL_PATH = Path("data/model.joblib")


def load_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    return None


def predict_shelf_life(request: ShelfLifeRequest) -> dict:
    model = load_model()
    if model is None:
        return {
            "estimated_shelf_life_days": max(0, 14 - request.age_days),
            "confidence": 0.4,
            "note": "Model not trained yet; using heuristic estimate.",
        }

    feature_vector = [
        request.age_days,
        request.temperature,
        request.humidity,
        1 if request.category.lower() == "fruit" else 0,
        1 if request.category.lower() == "vegetable" else 0,
    ]

    prediction = model.predict([feature_vector])[0]
    return {
        "estimated_shelf_life_days": int(max(0, round(prediction))),
        "confidence": 0.75,
        "note": "Prediction produced by trained shelf-life model.",
    }
