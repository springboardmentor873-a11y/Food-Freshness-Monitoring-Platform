import { apiClient } from "./api";

export async function getPredictionHistory(params) {
  const { data } = await apiClient.get("/api/v1/prediction-history", { params });
  return data;
}

export async function deletePredictionHistory(id) {
  await apiClient.delete(`/api/v1/prediction-history/${id}`);
}
