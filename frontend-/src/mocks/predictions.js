const FOOD_SAMPLES = [
  {
    name: "Organic Strawberries",
    category: "Fruits",
    freshnessScore: 91,
    confidence: 96,
    shelfLifeDays: 3,
    healthScore: 88,
    issues: [],
    storage: {
      temperature: "1-4°C",
      humidity: "90-95%",
      tips: [
        "Store unwashed in a ventilated container lined with paper towel.",
        "Keep away from ethylene-producing fruit like bananas and apples.",
        "Wash only right before eating to prevent premature softening.",
      ],
    },
  },
  {
    name: "Whole Milk 1L",
    category: "Dairy Products",
    freshnessScore: 62,
    confidence: 89,
    shelfLifeDays: 2,
    healthScore: 58,
    issues: ["Slight odor change detected", "Approaching printed best-by window"],
    storage: {
      temperature: "1-4°C",
      humidity: "N/A",
      tips: [
        "Keep on an interior fridge shelf, not the door, for stable temperature.",
        "Use within 2 days — do not leave at room temperature for more than 1 hour.",
        "Give it a smell check before use even if within date.",
      ],
    },
  },
  {
    name: "Atlantic Salmon Fillet",
    category: "Seafood",
    freshnessScore: 78,
    confidence: 93,
    shelfLifeDays: 1,
    healthScore: 74,
    issues: ["Minor discoloration at edges"],
    storage: {
      temperature: "0-2°C",
      humidity: "N/A",
      tips: [
        "Store on ice in the coldest part of the refrigerator.",
        "Cook or freeze within 24 hours for best quality.",
        "Keep tightly wrapped to prevent cross-contamination.",
      ],
    },
  },
  {
    name: "Roma Tomatoes",
    category: "Vegetables",
    freshnessScore: 24,
    confidence: 97,
    shelfLifeDays: 0,
    healthScore: 21,
    issues: ["Visible mold detected", "Significant softening", "Discoloration across surface"],
    storage: {
      temperature: "N/A",
      humidity: "N/A",
      tips: [
        "This batch shows spoilage indicators — discard rather than consume.",
        "Isolate from nearby produce to prevent mold spread.",
        "Review storage temperature for future batches — tomatoes prefer 12-15°C.",
      ],
    },
  },
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scoreCategory(score) {
  if (score >= 85) return "Fresh";
  if (score >= 70) return "Good";
  if (score >= 50) return "Acceptable";
  if (score >= 25) return "Near Spoilage";
  return "Spoiled";
}

/**
 * createMockPrediction — simulates a backend response for an uploaded image.
 * Replace with predictionService.analyzeImage(file) once FastAPI is live —
 * the shape returned here is what that endpoint should match.
 */
export function createMockPrediction(fileName = "Uploaded Item", previewUrl = null) {
  const base = randomFrom(FOOD_SAMPLES);
  const id = `pred-${Date.now()}`;

  return {
    id,
    itemName: fileName || base.name,
    category: base.category,
    previewUrl,
    analyzedAt: new Date().toISOString(),
    freshnessScore: base.freshnessScore,
    freshnessCategory: scoreCategory(base.freshnessScore),
    confidence: base.confidence,
    shelfLifeDays: base.shelfLifeDays,
    healthScore: base.healthScore,
    issues: base.issues,
    storage: base.storage,
  };
}

export function getStoredPrediction(id) {
  try {
    const raw = sessionStorage.getItem(`ffm-prediction-${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storePrediction(prediction) {
  try {
    sessionStorage.setItem(`ffm-prediction-${prediction.id}`, JSON.stringify(prediction));
  } catch {
    // sessionStorage unavailable — non-critical for a mock demo flow
  }
}

export { scoreCategory };
