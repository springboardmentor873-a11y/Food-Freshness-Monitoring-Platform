import { apiClient } from "./api";

export async function downloadPredictionReport(format) {
  const response = await apiClient.get("/api/v1/reports/prediction-history", { params: { format }, responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `prediction_history.${format === "xlsx" ? "xlsx" : format}`;
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
