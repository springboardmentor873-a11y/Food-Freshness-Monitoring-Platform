import { apiClient } from "./api";

export async function seedDemoData() {
  const response = await apiClient.post("/api/v1/system/seed-demo");
  return response.data;
}

export async function clearDemoData() {
  const response = await apiClient.delete("/api/v1/system/clear-demo");
  return response.data;
}
