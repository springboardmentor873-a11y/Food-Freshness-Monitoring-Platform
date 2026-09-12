"""
Central configuration for the Food Freshness Monitoring Platform.
"""
import os

# ---------------------------------------------------------------------------
# ML model
# ---------------------------------------------------------------------------
MODEL_DIR = os.getenv("MODEL_DIR", os.path.join(os.path.dirname(__file__), "ml", "artifacts"))
MODEL_PATH = os.path.join(MODEL_DIR, "freshness_model.keras")
CLASS_INDEX_PATH = os.path.join(MODEL_DIR, "class_indices.json")
IMG_SIZE = (260, 260)  # matches EfficientNetV2B2 native input

# The 5-tier freshness taxonomy required by the spec.
FRESHNESS_CATEGORIES = ["Fresh", "Good", "Acceptable", "Near Spoilage", "Spoiled"]

# Numeric anchor score for each category (0-100), used to turn a predicted
# class + confidence into a continuous "visual condition" sub-score.
CATEGORY_SCORE_ANCHOR = {
    "Fresh": 100,
    "Good": 80,
    "Acceptable": 60,
    "Near Spoilage": 35,
    "Spoiled": 10,
}

# ---------------------------------------------------------------------------
# Food categories (from spec section 4.2)
# ---------------------------------------------------------------------------
FOOD_CATEGORIES = [
    "Fruits",
    "Vegetables",
    "Dairy Products",
    "Meat & Poultry",
    "Seafood",
    "Bakery Products",
    "Packaged Foods",
    "Beverages",
]

# Baseline shelf life (in days, under IDEAL storage) per food category.
# These are reasonable industry-average defaults and should be refined with
# real supplier/food-safety data in production.
BASELINE_SHELF_LIFE_DAYS = {
    "Fruits": 10,
    "Vegetables": 9,
    "Dairy Products": 14,
    "Meat & Poultry": 4,
    "Seafood": 2,
    "Bakery Products": 5,
    "Packaged Foods": 180,
    "Beverages": 270,
}

# Ideal storage ranges per category: (temp_min_C, temp_max_C, humidity_min_%, humidity_max_%)
IDEAL_STORAGE = {
    "Fruits": (2, 8, 85, 95),
    "Vegetables": (0, 5, 90, 98),
    "Dairy Products": (1, 4, 70, 85),
    "Meat & Poultry": (-2, 2, 70, 85),
    "Seafood": (-2, 0, 80, 90),
    "Bakery Products": (18, 22, 40, 60),
    "Packaged Foods": (10, 25, 30, 60),
    "Beverages": (2, 25, 30, 70),
}

# Weighted scoring model (spec section 4.7):
SCORE_WEIGHTS = {
    "visual_condition": 0.40,
    "storage_conditions": 0.25,
    "shelf_life_prediction": 0.20,
    "product_age": 0.15,
}
