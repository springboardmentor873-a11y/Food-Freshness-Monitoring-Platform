"""
Shelf-Life Prediction Module.

Estimates remaining shelf-life (in days) and spoilage probability from:
  - product category (baseline shelf life under ideal conditions)
  - product age (days since received)
  - storage condition score (from storage_scoring service)
  - visual condition score (from image_analysis service)

This is a transparent, rule-based baseline model. It exposes the same
inputs/outputs a trained regression model (scikit-learn) would use, so it
can be swapped in later (see docs/ml_roadmap.md) without touching callers.
"""
from dataclasses import dataclass

from app.models import FoodCategory

# Baseline shelf life in days under ideal storage conditions, per category.
BASELINE_SHELF_LIFE_DAYS = {
    FoodCategory.fruits: 7,
    FoodCategory.vegetables: 10,
    FoodCategory.dairy: 10,
    FoodCategory.meat_poultry: 4,
    FoodCategory.seafood: 2,
    FoodCategory.bakery: 5,
    FoodCategory.packaged_foods: 180,
    FoodCategory.beverages: 270,
}


@dataclass
class ShelfLifeResult:
    predicted_remaining_shelf_life_days: float
    spoilage_probability: float
    product_age_score: float
    shelf_life_score: float


def predict_shelf_life(
    category: FoodCategory,
    age_days: float,
    storage_condition_score: float,
    visual_condition_score: float,
) -> ShelfLifeResult:
    baseline = BASELINE_SHELF_LIFE_DAYS.get(category, 7)

    # Poor storage accelerates spoilage; scale baseline life by storage quality.
    storage_multiplier = 0.4 + 0.6 * (storage_condition_score / 100.0)  # 0.4x - 1.0x
    effective_life = baseline * storage_multiplier

    remaining = max(0.0, effective_life - age_days)

    # Visual condition further discounts remaining life estimate: a food
    # that already looks degraded has less usable life than age alone suggests.
    visual_multiplier = 0.5 + 0.5 * (visual_condition_score / 100.0)  # 0.5x - 1.0x
    remaining = round(remaining * visual_multiplier, 2)

    # Spoilage probability rises as remaining life shrinks toward zero.
    if effective_life <= 0:
        spoilage_probability = 1.0
    else:
        life_fraction_used = min(1.0, age_days / effective_life)
        visual_risk = 1.0 - (visual_condition_score / 100.0)
        spoilage_probability = round(
            min(1.0, max(0.0, 0.6 * life_fraction_used + 0.4 * visual_risk)), 3
        )

    product_age_score = round(max(0.0, 100.0 - (age_days / max(baseline, 1)) * 100.0), 2)
    shelf_life_score = round(max(0.0, min(100.0, (remaining / max(baseline, 1)) * 100.0)), 2)

    return ShelfLifeResult(
        predicted_remaining_shelf_life_days=remaining,
        spoilage_probability=spoilage_probability,
        product_age_score=product_age_score,
        shelf_life_score=shelf_life_score,
    )
