import { apiClient } from "./api";
export async function getNotifications(params) { const { data } = await apiClient.get("/api/v1/notifications", { params }); return data; }
export async function markNotificationRead(id) { await apiClient.patch(`/api/v1/notifications/${id}/read`); }
export async function markAllNotificationsRead() { await apiClient.post("/api/v1/notifications/mark-all-read"); }
export async function getUnreadNotificationCount() { const { data } = await apiClient.get("/api/v1/notifications/unread-count"); return data; }
export async function deleteNotification(id) { await apiClient.delete(`/api/v1/notifications/${id}`); }


