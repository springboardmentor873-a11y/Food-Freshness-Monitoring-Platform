"""Configurable rule-based shelf-life assessment for model predictions."""

from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any

from app.core.config import settings


@dataclass(frozen=True, slots=True)
class ShelfLifeAssessment:
    shelf_life_days: int
    storage_recommendation: str
    consumption_recommendation: str


DEFAULT_RULES: dict[str, ShelfLifeAssessment] = {
    "fresh_bread": ShelfLifeAssessment(3, "Store in an airtight container at room temperature.", "Consume within 3 days."),
    "spoiled_bread": ShelfLifeAssessment(0, "Do not store with other food items.", "Discard immediately."),
    "fresh_dairy": ShelfLifeAssessment(7, "Keep refrigerated at or below 4°C.", "Consume within 7 days and before the package expiry date."),
    "spoiled_dairy": ShelfLifeAssessment(0, "Do not refrigerate for later use.", "Discard immediately."),
    "fresh_fruits": ShelfLifeAssessment(5, "Store refrigerated in a ventilated produce container.", "Consume within 5 days."),
    "spoiled_fruits": ShelfLifeAssessment(0, "Remove from nearby produce to avoid cross-spoilage.", "Discard immediately."),
    "fresh_vegetables": ShelfLifeAssessment(5, "Store refrigerated in a breathable produce bag.", "Consume within 5 days."),
    "spoiled_vegetables": ShelfLifeAssessment(0, "Remove from nearby produce to avoid cross-spoilage.", "Discard immediately."),
}


class ShelfLifeEngine:
    """Evaluates class-specific shelf-life rules with optional JSON overrides."""

    def __init__(self, rules: dict[str, ShelfLifeAssessment]) -> None:
        self._rules = rules

    @classmethod
    def from_settings(cls) -> "ShelfLifeEngine":
        rules = DEFAULT_RULES.copy()
        if settings.SHELF_LIFE_RULES_JSON:
            try:
                overrides: dict[str, dict[str, Any]] = json.loads(settings.SHELF_LIFE_RULES_JSON)
            except json.JSONDecodeError as exc:
                raise ValueError("SHELF_LIFE_RULES_JSON must be valid JSON") from exc
            for prediction, rule in overrides.items():
                if prediction not in rules:
                    raise ValueError(f"Unsupported shelf-life prediction class: {prediction}")
                days = rule.get("shelf_life_days")
                storage = rule.get("storage_recommendation")
                consumption = rule.get("consumption_recommendation")
                if not isinstance(days, int) or days < 0 or not isinstance(storage, str) or not isinstance(consumption, str):
                    raise ValueError(f"Invalid shelf-life rule for {prediction}")
                rules[prediction] = ShelfLifeAssessment(days, storage, consumption)
        return cls(rules)

    def assess(self, prediction: str) -> ShelfLifeAssessment:
        try:
            return self._rules[prediction]
        except KeyError as exc:
            raise ValueError(f"No shelf-life rule exists for {prediction}") from exc
