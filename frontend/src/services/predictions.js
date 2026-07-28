import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

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
    (data.freshness_status === "fresh" || data.freshness_status === "spoiled")
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
