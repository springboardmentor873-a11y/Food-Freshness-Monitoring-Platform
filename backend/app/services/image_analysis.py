"""
Food Image Analysis Engine.

This module implements a lightweight, dependency-friendly computer-vision
pipeline using OpenCV/NumPy to estimate visual freshness signals from a
food photo:

  - Color analysis        -> color_score (0-100, higher = fresher color profile)
  - Texture analysis       -> texture_score (0-100, higher = smoother/more uniform)
  - Mold detection         -> mold_risk_score (0-100, higher = more suspicious)
  - Bruising/damage        -> bruising_risk_score (0-100, higher = more suspicious)

These are intentionally implemented as interpretable heuristics (HSV color
distribution, Laplacian variance for texture roughness, dark/green-blue
blob detection for mold, brown/dark-patch detection for bruising) rather
than a black-box model, so the pipeline runs without GPUs or pretrained
weights. It is designed to be swapped out for a trained CNN/YOLO model
(see `docs/ml_roadmap.md`) without changing the calling code, since the
public function signature (`analyze_image`) and its return shape are the
integration contract with the rest of the system.
"""
from dataclasses import dataclass

import cv2
import numpy as np


@dataclass
class ImageAnalysisResult:
    color_score: float
    texture_score: float
    mold_risk_score: float
    bruising_risk_score: float
    visual_condition_score: float


def _load_image(image_path: str) -> np.ndarray:
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image at {image_path}")
    # Normalize size for consistent scoring across different upload resolutions
    return cv2.resize(image, (512, 512))


def _color_score(hsv: np.ndarray) -> float:
    """Fresh produce tends to have vivid, saturated color. Dull/desaturated
    or heavily browned/yellowed regions indicate aging."""
    saturation = hsv[:, :, 1].astype(np.float32) / 255.0
    value = hsv[:, :, 2].astype(np.float32) / 255.0
    vividness = float(np.mean(saturation) * np.mean(value))
    # scale into 0-100, calibrated so typical produce photos land 40-90
    score = min(100.0, max(0.0, vividness * 140))
    return round(score, 2)


def _texture_score(gray: np.ndarray) -> float:
    """Laplacian variance measures local intensity variation. Very high
    variance can indicate wrinkling/mold texture; very low can indicate
    an over-smoothed/mushy surface. We reward a moderate, produce-typical
    range and penalize the extremes."""
    lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    # Empirically, healthy produce photos land ~50-400 depending on lighting.
    ideal_low, ideal_high = 40, 400
    if ideal_low <= lap_var <= ideal_high:
        score = 100.0
    elif lap_var < ideal_low:
        score = max(0.0, 100.0 * (lap_var / ideal_low))
    else:
        score = max(0.0, 100.0 - (lap_var - ideal_high) / 20.0)
    return round(min(100.0, score), 2)


def _mold_risk_score(hsv: np.ndarray) -> float:
    """Detects blue-green/white fuzzy patches typical of mold growth using
    HSV color thresholds, and returns the % of image area matched."""
    lower_green = np.array([35, 40, 40])
    upper_green = np.array([90, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    # Whitish fuzzy mold: low saturation, high value
    lower_white = np.array([0, 0, 200])
    upper_white = np.array([180, 40, 255])
    white_mask = cv2.inRange(hsv, lower_white, upper_white)

    mold_mask = cv2.bitwise_or(green_mask, white_mask)
    ratio = float(np.count_nonzero(mold_mask)) / mold_mask.size
    score = min(100.0, ratio * 300)  # amplify since mold patches are usually small
    return round(score, 2)


def _bruising_risk_score(hsv: np.ndarray) -> float:
    """Detects dark brown/black patches typical of bruising, rot, or
    physical damage."""
    lower_brown = np.array([0, 40, 20])
    upper_brown = np.array([25, 255, 120])
    brown_mask = cv2.inRange(hsv, lower_brown, upper_brown)

    ratio = float(np.count_nonzero(brown_mask)) / brown_mask.size
    score = min(100.0, ratio * 250)
    return round(score, 2)


def analyze_image(image_path: str) -> ImageAnalysisResult:
    image = _load_image(image_path)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    color_score = _color_score(hsv)
    texture_score = _texture_score(gray)
    mold_risk_score = _mold_risk_score(hsv)
    bruising_risk_score = _bruising_risk_score(hsv)

    # Visual condition = positive signals minus risk signals, clamped 0-100
    visual_condition_score = round(
        max(
            0.0,
            min(
                100.0,
                0.5 * color_score + 0.5 * texture_score
                - 0.4 * mold_risk_score - 0.3 * bruising_risk_score,
            ),
        ),
        2,
    )

    return ImageAnalysisResult(
        color_score=color_score,
        texture_score=texture_score,
        mold_risk_score=mold_risk_score,
        bruising_risk_score=bruising_risk_score,
        visual_condition_score=visual_condition_score,
    )
