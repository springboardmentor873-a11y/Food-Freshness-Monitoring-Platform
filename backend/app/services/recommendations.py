"""
Recommendation Engine.

Produces human-readable storage, consumption, rotation, and waste-reduction
recommendations from an assessment's scores. Rule-based and easy to extend.
"""
from typing import List

from app.models import FreshnessCategory
from app.services.storage_scoring import StorageScoreResult
from app.services.image_analysis import ImageAnalysisResult


def build_recommendations(
    category: FreshnessCategory,
    image_result: ImageAnalysisResult,
    storage_result: StorageScoreResult,
    remaining_shelf_life_days: float,
) -> List[str]:
    recs: List[str] = []

    if category == FreshnessCategory.spoiled:
        recs.append("Discard this item immediately; it is assessed as spoiled and unsafe to consume.")
    elif category == FreshnessCategory.near_spoilage:
        recs.append("Prioritize this item for immediate use, discounting, or donation before it spoils.")
        recs.append("Move to the front of inventory rotation (FIFO) to reduce waste risk.")
    elif category == FreshnessCategory.acceptable:
        recs.append("Use within the next 1-2 days for best quality.")
    elif category == FreshnessCategory.good:
        recs.append("Good condition; continue standard monitoring and rotation.")
    else:  # fresh
        recs.append("Freshness is excellent; suitable for standard shelving and normal rotation.")

    if image_result.mold_risk_score > 30:
        recs.append("Visual analysis flagged possible mold growth — inspect manually before use or sale.")
    if image_result.bruising_risk_score > 30:
        recs.append("Visual analysis flagged possible bruising/physical damage — consider trimming or downgrading grade.")

    if storage_result.storage_condition_score < 70:
        recs.append(storage_result.notes)
        recs.append("Adjust storage temperature/humidity to the recommended range to extend shelf life.")

    if remaining_shelf_life_days <= 1:
        recs.append("Remaining shelf life is under 1 day — consider markdown pricing or immediate consumption.")

    return recs
