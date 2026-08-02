from datetime import datetime, timedelta
from pathlib import Path
import io
import time
import uuid

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from PIL import Image, UnidentifiedImageError


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "best_food_freshness_efficientnet.keras"

STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"

app = FastAPI(
    title="Food Freshness Monitoring",
    description="Food freshness inspection using EfficientNetB0",
    version="1.0.0",
)

app.mount(
    "/static",
    StaticFiles(directory=STATIC_DIR),
    name="static",
)

templates = Jinja2Templates(directory=TEMPLATES_DIR)


CLASS_NAMES = [
    "Apple_Fresh",
    "Apple_Rotten",
    "Banana_Fresh",
    "Banana_Rotten",
    "Bellpepper_Fresh",
    "Bellpepper_Rotten",
    "Bitter_Gourd_Fresh",
    "Bitter_Gourd_Rotten",
    "Carrot_Fresh",
    "Carrot_Rotten",
    "Cucumber_Fresh",
    "Cucumber_Rotten",
    "Grape_Fresh",
    "Grape_Rotten",
    "Grapes_Fresh",
    "Grapes_Rotten",
    "Guava_Fresh",
    "Guava_Rotten",
    "Jujube_Fresh",
    "Jujube_Rotten",
    "Kaki_Fresh",
    "Kaki_Rotten",
    "Lime_Fresh",
    "Lime_Rotten",
    "Mango_Fresh",
    "Mango_Rotten",
    "Orange_Fresh",
    "Orange_Rotten",
    "Papaya_Fresh",
    "Papaya_Rotten",
    "Peach_Fresh",
    "Peach_Rotten",
    "Pear_Fresh",
    "Pear_Rotten",
    "Pomegranate_Fresh",
    "Pomegranate_Rotten",
    "Potato_Fresh",
    "Potato_Rotten",
    "Strawberry_Fresh",
    "Strawberry_Rotten",
    "Tomato_Fresh",
    "Tomato_Rotten",
    "Watermelon_Fresh",
    "Watermelon_Rotten",
]


SHELF_LIFE_DAYS = {
    "Apple": 14,
    "Banana": 4,
    "Bellpepper": 7,
    "Bitter Gourd": 5,
    "Carrot": 14,
    "Cucumber": 7,
    "Grape": 7,
    "Grapes": 7,
    "Guava": 5,
    "Jujube": 7,
    "Kaki": 7,
    "Lime": 14,
    "Mango": 5,
    "Orange": 14,
    "Papaya": 4,
    "Peach": 5,
    "Pear": 7,
    "Pomegranate": 21,
    "Potato": 21,
    "Strawberry": 3,
    "Tomato": 7,
    "Watermelon": 7,
}


STORAGE_GUIDE = {
    "Apple": {
        "method": "Refrigerated storage",
        "temperature": "1–4°C",
        "tip": "Keep apples dry and separate from strongly scented food.",
    },
    "Banana": {
        "method": "Cool and dry storage",
        "temperature": "12–15°C",
        "tip": "Keep away from direct sunlight and separate overripe bananas.",
    },
    "Bellpepper": {
        "method": "Refrigerated storage",
        "temperature": "4–7°C",
        "tip": "Store unwashed in a ventilated produce bag.",
    },
    "Bitter Gourd": {
        "method": "Refrigerated storage",
        "temperature": "4–7°C",
        "tip": "Keep dry and use within a few days after cutting.",
    },
    "Carrot": {
        "method": "Refrigerated storage",
        "temperature": "1–4°C",
        "tip": "Use a sealed container to prevent moisture loss.",
    },
    "Cucumber": {
        "method": "Refrigerated storage",
        "temperature": "7–10°C",
        "tip": "Keep away from ethylene-producing fruits.",
    },
    "Grape": {
        "method": "Refrigerated storage",
        "temperature": "1–4°C",
        "tip": "Wash only before eating to reduce moisture damage.",
    },
    "Grapes": {
        "method": "Refrigerated storage",
        "temperature": "1–4°C",
        "tip": "Store in a ventilated container and remove damaged grapes.",
    },
    "Guava": {
        "method": "Cool or refrigerated storage",
        "temperature": "5–10°C",
        "tip": "Refrigerate after ripening.",
    },
    "Jujube": {
        "method": "Refrigerated storage",
        "temperature": "4–7°C",
        "tip": "Keep dry and use a breathable container.",
    },
    "Kaki": {
        "method": "Cool storage",
        "temperature": "5–10°C",
        "tip": "Allow firm fruit to ripen at room temperature.",
    },
    "Lime": {
        "method": "Refrigerated storage",
        "temperature": "4–7°C",
        "tip": "Store in a sealed bag to reduce moisture loss.",
    },
    "Mango": {
        "method": "Cool storage until ripe",
        "temperature": "10–13°C",
        "tip": "Refrigerate only after the mango ripens.",
    },
    "Orange": {
        "method": "Cool or refrigerated storage",
        "temperature": "4–10°C",
        "tip": "Keep dry and remove damaged fruit.",
    },
    "Papaya": {
        "method": "Refrigerate after ripening",
        "temperature": "4–7°C",
        "tip": "Keep unripe papaya at room temperature.",
    },
    "Peach": {
        "method": "Refrigerate after ripening",
        "temperature": "1–4°C",
        "tip": "Handle carefully to avoid bruising.",
    },
    "Pear": {
        "method": "Refrigerate after ripening",
        "temperature": "1–4°C",
        "tip": "Ripen at room temperature before refrigeration.",
    },
    "Pomegranate": {
        "method": "Cool or refrigerated storage",
        "temperature": "4–10°C",
        "tip": "Keep whole fruit dry and refrigerate opened seeds.",
    },
    "Potato": {
        "method": "Dark and ventilated storage",
        "temperature": "7–10°C",
        "tip": "Keep away from sunlight, moisture and onions.",
    },
    "Strawberry": {
        "method": "Refrigerated storage",
        "temperature": "1–4°C",
        "tip": "Keep dry and remove mouldy berries immediately.",
    },
    "Tomato": {
        "method": "Room temperature until ripe",
        "temperature": "10–15°C",
        "tip": "Refrigerate only when fully ripe or cut.",
    },
    "Watermelon": {
        "method": "Cool storage",
        "temperature": "4–10°C",
        "tip": "Refrigerate immediately after cutting.",
    },
}


DEFAULT_STORAGE = {
    "method": "Refrigerated storage",
    "temperature": "3–5°C",
    "tip": "Keep the food clean, dry and properly covered.",
}


if not MODEL_PATH.exists():
    raise RuntimeError(
        f"Model file not found: {MODEL_PATH}"
    )

model = tf.keras.models.load_model(MODEL_PATH)


def get_food_name(prediction: str) -> str:
    food_name = prediction.rsplit("_", 1)[0]
    return food_name.replace("_", " ").title()


def get_quality_grade(
    is_fresh: bool,
    confidence: float,
) -> str:
    if not is_fresh:
        return "F"

    if confidence >= 95:
        return "A+"

    if confidence >= 90:
        return "A"

    if confidence >= 80:
        return "B"

    if confidence >= 70:
        return "C"

    return "Review"


def get_quality_label(
    is_fresh: bool,
    confidence: float,
) -> str:
    if not is_fresh:
        return "Spoiled"

    if confidence >= 95:
        return "Excellent"

    if confidence >= 85:
        return "Good"

    if confidence >= 70:
        return "Acceptable"

    return "Needs manual inspection"


def get_spoilage_risk(
    is_fresh: bool,
    confidence: float,
) -> dict:
    if not is_fresh:
        return {
            "level": "High",
            "probability": round(confidence, 2),
        }

    probability = round(
        max(0, 100 - confidence),
        2,
    )

    if probability <= 5:
        risk_level = "Very Low"
    elif probability <= 15:
        risk_level = "Low"
    elif probability <= 30:
        risk_level = "Moderate"
    else:
        risk_level = "Needs Review"

    return {
        "level": risk_level,
        "probability": probability,
    }


def get_shelf_life(
    food_name: str,
    is_fresh: bool,
    confidence: float,
) -> dict:
    if not is_fresh:
        return {
            "status": "Expired / Spoiled",
            "days_remaining": 0,
            "consume_before": "Do not consume",
            "percentage": 0,
        }

    base_days = SHELF_LIFE_DAYS.get(food_name, 5)

    confidence_factor = max(
        min(confidence / 100, 1.0),
        0.45,
    )

    days_remaining = max(
        1,
        round(base_days * confidence_factor),
    )

    consume_before = (
        datetime.now().date()
        + timedelta(days=days_remaining)
    )

    if days_remaining <= 2:
        status = "Consume Immediately"
    elif days_remaining <= 5:
        status = "Use Soon"
    else:
        status = "Within Safe Period"

    percentage = min(
        100,
        round((days_remaining / base_days) * 100),
    )

    return {
        "status": status,
        "days_remaining": days_remaining,
        "consume_before": consume_before.strftime(
            "%d %B %Y"
        ),
        "percentage": percentage,
    }


def get_recommendation(
    food_name: str,
    is_fresh: bool,
    days_remaining: int,
) -> str:
    if not is_fresh:
        return (
            "Do not consume this food item. Separate it "
            "from fresh food and dispose of it safely to "
            "reduce contamination risk."
        )

    if days_remaining <= 2:
        return (
            f"Use this {food_name.lower()} immediately. "
            "Check its smell, texture and visible condition "
            "before consumption."
        )

    if days_remaining <= 5:
        return (
            f"Use this {food_name.lower()} within the next "
            "few days and maintain the recommended storage "
            "conditions."
        )

    return (
        f"This {food_name.lower()} appears suitable for "
        "consumption. Store it correctly and continue "
        "monitoring its colour, smell and texture."
    )


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={},
    )


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "EfficientNetB0",
        "classes": len(CLASS_NAMES),
    }


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
):
    started_at = time.perf_counter()

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=(
                "Please upload a JPG, JPEG, "
                "PNG or WEBP image."
            ),
        )

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    try:
        image = Image.open(
            io.BytesIO(file_bytes)
        ).convert("RGB")
    except UnidentifiedImageError as error:
        raise HTTPException(
            status_code=400,
            detail="The selected file is not a valid image.",
        ) from error

    image = image.resize((224, 224))

    image_array = tf.keras.utils.img_to_array(image)
    image_array = np.expand_dims(
        image_array,
        axis=0,
    )

    predictions = model.predict(
        image_array,
        verbose=0,
    )

    class_index = int(
        np.argmax(predictions[0])
    )

    confidence = float(
        np.max(predictions[0]) * 100
    )

    prediction = CLASS_NAMES[class_index]
    food_name = get_food_name(prediction)

    is_fresh = prediction.endswith("_Fresh")

    freshness_status = (
        "Fresh"
        if is_fresh
        else "Spoiled"
    )

    freshness_score = (
        round(confidence, 2)
        if is_fresh
        else round(max(0, 100 - confidence), 2)
    )

    shelf_life = get_shelf_life(
        food_name=food_name,
        is_fresh=is_fresh,
        confidence=confidence,
    )

    spoilage_risk = get_spoilage_risk(
        is_fresh=is_fresh,
        confidence=confidence,
    )

    storage = STORAGE_GUIDE.get(
        food_name,
        DEFAULT_STORAGE,
    )

    processing_time = round(
        time.perf_counter() - started_at,
        2,
    )

    return {
        "inspection_id": (
            f"FQ-{uuid.uuid4().hex[:8].upper()}"
        ),
        "inspection_date": datetime.now().strftime(
            "%d %B %Y"
        ),
        "inspection_time": datetime.now().strftime(
            "%I:%M %p"
        ),
        "food_name": food_name,
        "prediction": prediction,
        "freshness_status": freshness_status,
        "confidence": round(confidence, 2),
        "freshness_score": freshness_score,
        "quality_grade": get_quality_grade(
            is_fresh,
            confidence,
        ),
        "quality_label": get_quality_label(
            is_fresh,
            confidence,
        ),
        "spoilage_risk": spoilage_risk,
        "shelf_life": shelf_life,
        "storage": storage,
        "consumption_status": (
            "Suitable for consumption"
            if is_fresh
            else "Not suitable for consumption"
        ),
        "recommendation": get_recommendation(
            food_name=food_name,
            is_fresh=is_fresh,
            days_remaining=shelf_life[
                "days_remaining"
            ],
        ),
        "processing_time": processing_time,
        "model_information": {
            "name": "EfficientNetB0",
            "classes": 44,
            "test_accuracy": 96.89,
        },
        "disclaimer": (
            "Shelf-life information is an estimated "
            "recommendation. Actual food safety also "
            "depends on smell, temperature, humidity, "
            "handling, packaging and storage history."
        ),
    }