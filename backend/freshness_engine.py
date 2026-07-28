import numpy as np
from PIL import Image

def analyze_visual_features(image: Image.Image, model_verdict: str, class_idx: int):
    """Calculates detailed visual feature indicators from food image pixel array"""
    if image.mode != 'RGB':
        image = image.convert('RGB')
        
    arr = np.array(image.resize((150, 150)), dtype=np.float32)
    # Evaluate center 60% food object region to exclude background borders
    center_arr = arr[30:120, 30:120]
    r, g, b = center_arr[:,:,0], center_arr[:,:,1], center_arr[:,:,2]
    brightness = (0.299 * r + 0.587 * g + 0.114 * b)

    # 1. Color Degradation (Brownish, greyish, or heavily darkened discolored pixels ratio)
    is_discolored = ((r > b * 1.15) & (g < r * 0.82) & (brightness < 140)) | ((brightness < 60) & (r < 100))
    color_degradation = min(100.0, float(np.mean(is_discolored) * 350))
    
    # 2. Texture Degradation (Local spatial pixel variance)
    gray = brightness
    diff_x = np.abs(gray[:, 1:] - gray[:, :-1])
    diff_y = np.abs(gray[1:, :] - gray[:-1, :])
    texture_variance = float(np.mean(diff_x) + np.mean(diff_y))
    texture_degradation = min(100.0, max(5.0, texture_variance * 2.2))
    
    # 3. Mold / Spoilage Patch Detection (Dark brown or fuzzy grey patches)
    is_mold_patch = (brightness < 65) | ((np.abs(r - g) < 15) & (b < 80) & (r < 80))
    mold_prob = min(100.0, float(np.mean(is_mold_patch) * 300))
    
    # Align with class prediction if class is explicit
    if class_idx == 3: # Spoiled
        color_degradation = max(color_degradation, 75.0)
        texture_degradation = max(texture_degradation, 70.0)
        mold_prob = max(mold_prob, 85.0)
    elif class_idx == 2: # Near Spoilage
        color_degradation = max(color_degradation, 45.0)
        texture_degradation = max(texture_degradation, 40.0)
        mold_prob = min(mold_prob, 35.0)
    elif class_idx == 0: # Fresh
        color_degradation = min(color_degradation, 15.0)
        mold_prob = min(mold_prob, 5.0)

    # Physical damage / Bruising Index
    bruising_index = round(min(100.0, (color_degradation * 0.5 + texture_degradation * 0.5)), 1)
    
    return {
        "color_degradation": round(color_degradation, 1),
        "texture_degradation": round(texture_degradation, 1),
        "mold_probability": round(mold_prob, 1),
        "bruising_index": bruising_index
    }

def calculate_shelf_life(class_idx: int, category: str, temp_c: float = 4.0, humidity_pct: float = 85.0, visual_features: dict = None, probs: list = None):
    """
    Predicts remaining shelf life in days & hours based on continuous visual features,
    model prediction probabilities, class index & storage conditions.
    """
    color_deg = visual_features.get("color_degradation", 10.0) if visual_features else 10.0
    texture_deg = visual_features.get("texture_degradation", 15.0) if visual_features else 15.0
    mold_prob = visual_features.get("mold_probability", 0.0) if visual_features else 0.0
    bruising = visual_features.get("bruising_index", 10.0) if visual_features else 10.0

    # Visual health factor (1.0 = perfect fresh, 0.0 = completely degraded)
    visual_health = max(0.0, 1.0 - (color_deg * 0.005 + texture_deg * 0.004 + mold_prob * 0.01 + bruising * 0.003))

    # Model probability weighted base days
    if probs and len(probs) == 4:
        weighted_days = (probs[0] * 7.5 + probs[1] * 4.8 + probs[2] * 2.2 + probs[3] * 0.0)
    else:
        base_map = {0: 7.5, 1: 4.8, 2: 2.2, 3: 0.0}
        weighted_days = base_map.get(class_idx, 4.0)

    # Combine model probability weighted days with visual health factor
    base_days = max(0.0, weighted_days * (0.35 + 0.65 * visual_health))

    if base_days < 0.2 or mold_prob > 50.0 or class_idx == 3:
        return {
            "days_remaining": 0.0,
            "days_display": "0 Days (Expired)",
            "hours_remaining": 0,
            "recommended_action": "Discard immediately. Do not consume.",
            "urgency": "High",
            "storage_factor": 1.0
        }

    # Temperature & Humidity degradation factors
    if temp_c > 4.0:
        temp_factor = 1.0 / (1.15 ** (temp_c - 4.0))
    else:
        temp_factor = 1.0 + (4.0 - temp_c) * 0.05

    if humidity_pct < 60.0:
        humidity_factor = 0.85
    elif humidity_pct > 92.0:
        humidity_factor = 0.80
    else:
        humidity_factor = 1.0

    adjusted_days = round(max(0.1, base_days * temp_factor * humidity_factor), 1)
    hours = int(round(adjusted_days * 24))

    if adjusted_days >= 3.0:
        urgency = "Low"
        recommended_action = "Store in crisper drawer at 3-5°C to maintain freshness."
    elif adjusted_days >= 1.0:
        urgency = "Medium"
        recommended_action = "Consume within 24-48 hours or freeze to prevent spoilage."
    else:
        urgency = "High"
        recommended_action = "Cook or consume today. Nearing expiration."

    return {
        "days_remaining": adjusted_days,
        "days_display": f"{adjusted_days} Days ({hours}h)",
        "hours_remaining": hours,
        "recommended_action": recommended_action,
        "urgency": urgency,
        "storage_factor": round(temp_factor * humidity_factor, 2)
    }

def generate_recommendations(class_idx: int, visual_features: dict, shelf_life: dict):
    """Generates dynamic, personalized storage and action recommendations tailored to each image's features"""
    recs = []
    days = shelf_life.get("days_remaining", 0.0)
    color_deg = visual_features.get("color_degradation", 0.0) if visual_features else 0.0
    texture_deg = visual_features.get("texture_degradation", 0.0) if visual_features else 0.0
    mold_prob = visual_features.get("mold_probability", 0.0) if visual_features else 0.0
    bruising = visual_features.get("bruising_index", 0.0) if visual_features else 0.0

    # 1. Action & Consumption Urgency
    if days >= 5.0:
        recs.append(f"Peak Freshness: Excellent quality with ~{days} days remaining window.")
        recs.append("Store sealed in a ventilated container in the refrigerator crisper drawer (3°C - 5°C).")
    elif days >= 2.5:
        recs.append(f"Good Condition: Recommended for consumption within the next {days} days.")
        recs.append("Store in crisper drawer to minimize moisture loss and preserve firmness.")
    elif days >= 1.0:
        recs.append(f"ATTENTION: Consume within {days} days (approx. {int(days*24)} hours).")
        recs.append("Ideal for cooking, blending into smoothies, or preparing baked dishes today.")
        recs.append("If not consuming within 24 hours, chop and freeze at -18°C.")
    else:
        recs.append("CRITICAL: Food item shows clear spoilage / mold contamination indicators.")
        recs.append("Do not consume! Risk of bacterial contamination.")
        recs.append("Safely dispose in organic waste or compost bin.")
        return recs

    # 2. Visual Feature Specific Action Items
    if mold_prob > 15.0:
        recs.append(f"Mold Alert ({mold_prob}% confidence): Early fungal patch detected. Separate from other produce.")
    elif color_deg > 35.0:
        recs.append(f"Surface Discoloration ({color_deg}%): Wash thoroughly and cut away browned areas before eating.")
    elif bruising > 30.0:
        recs.append(f"Physical Bruising ({bruising}%): Surface damage detected. Handle gently to prevent mold propagation.")

    if texture_deg > 45.0:
        recs.append(f"Texture Degradation ({texture_deg}%): Softening observed. Best consumed cooked or pureed.")

    return recs
