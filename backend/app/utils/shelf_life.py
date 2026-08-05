from typing import Dict, Any, List, Tuple

CATEGORY_MAPPING = {
    "fresh_bread": ("Bakery", "Fresh Artisan Bread", True),
    "fresh_dairy": ("Dairy Products", "Fresh Milk & Dairy", True),
    "fresh_fruits": ("Fruits", "Fresh Seasonal Fruits", True),
    "fresh_vegetables": ("Vegetables", "Fresh Green Vegetables", True),
    "spoiled_bread": ("Bakery", "Spoiled / Moldy Bread", False),
    "spoiled_dairy": ("Dairy Products", "Spoiled Milk & Dairy", False),
    "spoiled_fruits": ("Fruits", "Spoiled / Decayed Fruit", False),
    "spoiled_vegetables": ("Vegetables", "Spoiled Vegetables", False),
}

def get_score_category(score: float) -> str:
    if score >= 85:
        return "Fresh"
    elif score >= 70:
        return "Good"
    elif score >= 50:
        return "Acceptable"
    elif score >= 25:
        return "Near Spoilage"
    else:
        return "Spoiled"

def generate_freshness_insights(predicted_class: str, confidence: float) -> Dict[str, Any]:
    cat_info = CATEGORY_MAPPING.get(
        predicted_class,
        ("General Produce", predicted_class.replace("_", " ").title(), "fresh" in predicted_class)
    )
    category, item_name, is_fresh = cat_info

    # Freshness score (0 - 100 scale)
    if is_fresh:
        freshness_score = round(65.0 + 34.0 * (confidence / 100.0), 1)
    else:
        freshness_score = round(30.0 * (1.0 - (confidence / 100.0)), 1)
        freshness_score = max(5.0, freshness_score)

    freshness_category = get_score_category(freshness_score)

    # Shelf life days estimation
    if not is_fresh:
        shelf_life_days = 0
    else:
        if "fruits" in predicted_class:
            shelf_life_days = max(1, int(round(3 + (confidence / 100.0) * 3)))
        elif "vegetables" in predicted_class:
            shelf_life_days = max(1, int(round(4 + (confidence / 100.0) * 4)))
        elif "dairy" in predicted_class:
            shelf_life_days = max(1, int(round(3 + (confidence / 100.0) * 4)))
        else:  # bread
            shelf_life_days = max(1, int(round(2 + (confidence / 100.0) * 3)))

    # Food Health Score
    if is_fresh:
        health_score = round(min(100.0, freshness_score * 0.96), 1)
    else:
        health_score = round(max(0.0, freshness_score * 0.45), 1)

    # Issues array
    if not is_fresh:
        issues = [
            "Visible spoilage & discoloration detected",
            "Microbial / fungal growth probability elevated",
            "Unsafe for consumption — discard item"
        ]
    else:
        if freshness_score >= 85:
            issues = []
        else:
            issues = ["Slight surface aging observed", "Consume within predicted shelf life"]

    # Storage recommendations
    if "fruits" in predicted_class:
        storage = {
            "temperature": "4-7°C",
            "humidity": "85-90%",
            "tips": [
                "Store unwashed in a ventilated crisping drawer.",
                "Keep separate from ethylene producers (apples, bananas).",
                "Wash only prior to consumption to prevent moisture buildup."
            ]
        }
    elif "vegetables" in predicted_class:
        storage = {
            "temperature": "3-5°C",
            "humidity": "90-95%",
            "tips": [
                "Keep in high-humidity drawer lined with paper towel.",
                "Maintain gentle air circulation to delay wilt.",
                "Trim any damaged foliage before refrigerating."
            ]
        }
    elif "dairy" in predicted_class:
        storage = {
            "temperature": "1-4°C",
            "humidity": "N/A",
            "tips": [
                "Store on interior main fridge shelf, avoiding door storage.",
                "Ensure container is tightly sealed after every open.",
                "Keep away from strong pungent foods."
            ]
        }
    else:  # bread
        storage = {
            "temperature": "18-22°C",
            "humidity": "Low (< 60%)",
            "tips": [
                "Store in a breathable breadbox or dry pantry container.",
                "Do not refrigerate, as cold air accelerates staling.",
                "Slice and freeze for long-term storage beyond 3 days."
            ]
        }

    return {
        "itemName": item_name,
        "category": category,
        "freshnessScore": freshness_score,
        "freshnessCategory": freshness_category,
        "shelfLifeDays": shelf_life_days,
        "healthScore": health_score,
        "issues": issues,
        "storage": storage,
    }
