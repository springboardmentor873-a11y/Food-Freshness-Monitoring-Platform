import { apiClient } from "./api";

export class InvalidPredictionResponseError extends Error {
  constructor() {
    super("The prediction service returned an invalid response.");
    this.name = "InvalidPredictionResponseError";
  }
}

function isPredictionResponse(data) {
  return (
    data &&
    typeof data.predicted_class === "string" &&
    Number.isFinite(data.confidence) &&
    data.confidence >= 0 &&
    data.confidence <= 1 &&
    (data.freshness_status === "fresh" || data.freshness_status === "spoiled") &&
    Number.isInteger(data.shelf_life_days) &&
    data.shelf_life_days >= 0 &&
    typeof data.storage_recommendation === "string" &&
    typeof data.consumption_recommendation === "string" &&
    typeof data.food_safety_advice === "string" &&
    typeof data.waste_reduction_advice === "string"
  );
}

export async function predictFoodFreshness(imageFile, signal) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await apiClient.post("/api/v1/predict", formData, { signal });

  if (!isPredictionResponse(data)) {
    throw new InvalidPredictionResponseError();
  }

  return data;
}
