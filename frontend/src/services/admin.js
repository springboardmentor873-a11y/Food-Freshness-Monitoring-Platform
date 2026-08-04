import { apiClient } from "./api";

export async function getAdminUsers(params = {}) {
  const response = await apiClient.get("/api/v1/admin/users", { params });
  return response.data;
}

export async function updateUserRole(userId, payload) {
  const response = await apiClient.patch(`/api/v1/admin/users/${userId}`, payload);
  return response.data;
}

export async function getAdminStats() {
  const response = await apiClient.get("/api/v1/admin/stats");
  return response.data;
}

export async function getSystemStatus() {
  const response = await apiClient.get("/api/v1/admin/system-status");
  return response.data;
}
