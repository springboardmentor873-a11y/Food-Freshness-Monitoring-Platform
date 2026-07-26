"""
Storage Condition Monitoring & Scoring.

Compares a food item's actual storage temperature/humidity against
category-appropriate reference ranges and produces a 0-100 compliance
score. Reference ranges are simplified, commonly-cited guidelines per
food category (kept in one place so they're easy to tune per deployment).
"""
from dataclasses import dataclass
from typing import Optional

from app.models import FoodCategory

# (min_temp_c, max_temp_c, min_humidity_pct, max_humidity_pct)
STORAGE_GUIDELINES = {
    FoodCategory.fruits: (2.0, 13.0, 85.0, 95.0),
    FoodCategory.vegetables: (0.0, 10.0, 90.0, 98.0),
    FoodCategory.dairy: (1.0, 4.0, 60.0, 85.0),
    FoodCategory.meat_poultry: (-2.0, 4.0, 75.0, 85.0),
    FoodCategory.seafood: (-2.0, 2.0, 80.0, 90.0),
    FoodCategory.bakery: (15.0, 24.0, 40.0, 60.0),
    FoodCategory.packaged_foods: (10.0, 25.0, 30.0, 60.0),
    FoodCategory.beverages: (2.0, 20.0, 30.0, 70.0),
}


@dataclass
class StorageScoreResult:
    storage_condition_score: float
    notes: str


def _range_penalty(value: Optional[float], low: float, high: float, scale: float) -> float:
    if value is None:
        return 15.0  # missing sensor data -> moderate penalty, not zero
    if low <= value <= high:
        return 0.0
    deviation = min(low - value, value - high) if value < low or value > high else 0.0
    deviation = max(deviation, (low - value) if value < low else (value - high))
    return min(50.0, abs(deviation) * scale)


def score_storage_conditions(
    category: FoodCategory,
    temperature_c: Optional[float],
    humidity_pct: Optional[float],
) -> StorageScoreResult:
    low_t, high_t, low_h, high_h = STORAGE_GUIDELINES.get(
        category, (0.0, 25.0, 40.0, 90.0)
    )

    temp_penalty = _range_penalty(temperature_c, low_t, high_t, scale=6.0)
    humidity_penalty = _range_penalty(humidity_pct, low_h, high_h, scale=2.0)

    score = max(0.0, 100.0 - temp_penalty - humidity_penalty)

    notes = []
    if temperature_c is not None and not (low_t <= temperature_c <= high_t):
        notes.append(
            f"Storage temperature {temperature_c}\u00b0C is outside the "
            f"recommended {low_t}\u2013{high_t}\u00b0C range for {category.value}."
        )
    if humidity_pct is not None and not (low_h <= humidity_pct <= high_h):
        notes.append(
            f"Storage humidity {humidity_pct}% is outside the recommended "
            f"{low_h}\u2013{high_h}% range for {category.value}."
        )
    if temperature_c is None or humidity_pct is None:
        notes.append("Some storage sensor data was missing; score is an estimate.")

    return StorageScoreResult(
        storage_condition_score=round(score, 2),
        notes=" ".join(notes) if notes else "Storage conditions within recommended range.",
    )
