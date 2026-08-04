import { apiClient } from "./api";

export async function getInventory(params) {
  const { data } = await apiClient.get("/api/v1/inventory", { params });
  return data;
}

export async function deleteInventoryItem(id) {
  await apiClient.delete(`/api/v1/inventory/${id}`);
}

export async function createInventory(payload) {
  const { data } = await apiClient.post("/api/v1/inventory", payload);
  return data;
}

export async function updateInventory(id, payload) {
  const { data } = await apiClient.put(`/api/v1/inventory/${id}`, payload);
  return data;
}

export async function bulkDeleteInventory(itemIds) {
  const { data } = await apiClient.post("/api/v1/inventory/bulk-delete", { item_ids: itemIds });
  return data;
}

export async function bulkImportInventory(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/api/v1/inventory/bulk-import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

