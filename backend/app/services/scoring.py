"""
Freshness Scoring Engine.

Implements the weighted scoring model from the project spec:

    Freshness Score =
        Visual Condition Analysis  (40%)
      + Storage Conditions         (25%)
      + Shelf-Life Prediction      (20%)
      + Product Age                (15%)

All inputs are already normalized to a 0-100 scale by their respective
services (image_analysis, storage_scoring, shelf_life).
"""
from app.models import FreshnessCategory

WEIGHTS = {
    "visual_condition": 0.40,
    "storage_condition": 0.25,
    "shelf_life": 0.20,
    "product_age": 0.15,
}


def compute_overall_score(
    visual_condition_score: float,
    storage_condition_score: float,
    shelf_life_score: float,
    product_age_score: float,
) -> float:
    score = (
        visual_condition_score * WEIGHTS["visual_condition"]
        + storage_condition_score * WEIGHTS["storage_condition"]
        + shelf_life_score * WEIGHTS["shelf_life"]
        + product_age_score * WEIGHTS["product_age"]
    )
    return round(max(0.0, min(100.0, score)), 2)


def categorize(score: float) -> FreshnessCategory:
    if score >= 85:
        return FreshnessCategory.fresh
    if score >= 65:
        return FreshnessCategory.good
    if score >= 45:
        return FreshnessCategory.acceptable
    if score >= 25:
        return FreshnessCategory.near_spoilage
    return FreshnessCategory.spoiled
