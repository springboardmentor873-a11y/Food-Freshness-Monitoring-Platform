"""Prediction-specific food handling and waste-reduction recommendations."""

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class FoodRecommendation:
    storage_advice: str
    food_safety_advice: str
    consumption_advice: str
    waste_reduction_advice: str


RECOMMENDATIONS: dict[str, FoodRecommendation] = {
    "fresh_bread": FoodRecommendation("Keep sealed at room temperature away from moisture.", "Inspect for mold before every use.", "Use within the estimated shelf-life window.", "Freeze sliced leftovers before staleness develops."),
    "spoiled_bread": FoodRecommendation("Keep separate from edible food until disposal.", "Do not remove visible mold and consume the remaining bread.", "Do not consume.", "Compost only where local guidance permits; otherwise discard in sealed waste."),
    "fresh_dairy": FoodRecommendation("Refrigerate continuously at or below 4°C.", "Return to refrigeration immediately after serving.", "Consume before the recommended date and package expiry.", "Use near-expiry dairy in cooked meals or freeze where suitable."),
    "spoiled_dairy": FoodRecommendation("Keep container closed and separate until disposal.", "Do not taste dairy to determine safety.", "Do not consume.", "Discard safely; clean any surfaces exposed to leaks."),
    "fresh_fruits": FoodRecommendation("Refrigerate ripe fruit in a ventilated produce container.", "Wash fruit immediately before eating, not before storage.", "Consume within the recommended period.", "Blend soft but safe fruit into smoothies or freeze for later use."),
    "spoiled_fruits": FoodRecommendation("Remove spoiled fruit from nearby produce immediately.", "Discard fruit showing mold, fermentation, or off odors.", "Do not consume.", "Compost only non-moldy plant material where accepted; otherwise discard."),
    "fresh_vegetables": FoodRecommendation("Refrigerate in a breathable produce bag.", "Wash vegetables immediately before preparation.", "Use within the recommended period.", "Use wilting but safe vegetables in soups, stocks, or stir-fries."),
    "spoiled_vegetables": FoodRecommendation("Remove from storage with other vegetables immediately.", "Discard vegetables with mold, slime, or strong off odors.", "Do not consume.", "Compost only according to local rules; sanitize the storage container."),
}


class RecommendationEngine:
    """Returns the handling guidance associated with a model prediction class."""

    def generate(self, prediction: str) -> FoodRecommendation:
        try:
            return RECOMMENDATIONS[prediction]
        except KeyError as exc:
            raise ValueError(f"No recommendation exists for {prediction}") from exc
