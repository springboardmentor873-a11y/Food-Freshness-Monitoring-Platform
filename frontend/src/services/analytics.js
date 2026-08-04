import { apiClient } from "./api";

export async function getAnalyticsOverview(days = 30) {
  const { data } = await apiClient.get("/api/v1/analytics/overview", { params: { days } });
  return data;
}
