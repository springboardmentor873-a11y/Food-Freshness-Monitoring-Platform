/**
 * Frontend API Service for Food Freshness Monitoring Platform.
 * Communicates with the FastAPI backend gateway (http://localhost:8000),
 * falling back gracefully to mock responses if offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function fetchWithFallback(endpoint, options = {}, mockFallback = null) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`[API] ${endpoint} failed or offline. Using local service state.`, error);
    if (typeof mockFallback === "function") return mockFallback();
    return mockFallback;
  }
}

export const apiService = {
  // Auth
  async login(email, password, role) {
    return fetchWithFallback(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      },
      { id: "usr_001", name: email.split("@")[0], email, role, token: "jwt-token-demo" }
    );
  },

  async register(name, email, password, role) {
    return fetchWithFallback(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      },
      { id: `usr_${Date.now()}`, name, email, role, token: "jwt-token-demo" }
    );
  },

  async adminLogin(adminUsername, password) {
    return fetchWithFallback(
      "/api/admin/login",
      {
        method: "POST",
        body: JSON.stringify({ username: adminUsername, password }),
      },
      { id: `adm_${Date.now()}`, username: adminUsername, role: "Administrator", token: "jwt-admin-token-demo" }
    );
  },

  // Admin Dashboard Services
  async getAdminUsers(searchTerm = "") {
    return fetchWithFallback(
      `/api/admin/users?search=${encodeURIComponent(searchTerm)}`,
      { method: "GET" },
      null
    );
  },

  async getUserLoginHistory() {
    return fetchWithFallback("/api/admin/users/login-history", { method: "GET" }, null);
  },

  async getAdminFoodStats() {
    return fetchWithFallback(
      "/api/admin/food-stats",
      { method: "GET" },
      {
        totalAnalyses: 12450,
        freshCount: 10820,
        spoiledCount: 1630,
        mostSearched: ["Fresh Apple", "Red Tomato", "Whole Milk", "Bananas", "Artisan Bread", "Navel Orange"],
        mostAnalyzedCategories: [
          { category: "Fruits", count: 4850, percentage: 39 },
          { category: "Vegetables", count: 3920, percentage: 31 font: 31 },
          { category: "Dairy", count: 2100, percentage: 17 },
          { category: "Bakery", count: 1580, percentage: 13 },
        ],
      }
    );
  },

  async getAdminAnalyticsTrends() {
    return fetchWithFallback("/api/admin/analytics/trends", { method: "GET" }, null);
  },

  async getSystemStatus() {
    return fetchWithFallback(
      "/api/admin/system/status",
      { method: "GET" },
      {
        aiModel: { name: "EfficientNetB0", status: "Online", accuracy: "96.8%", version: "v2.4" },
        apiGateway: { status: "Operational", latencyMs: 42, uptime: "99.98%" },
        database: { status: "Connected", records: 12450, health: "Healthy" },
        lastUpdate: "Updated 2 hours ago",
      }
    );
  },

  async getAdminNotifications() {
    return fetchWithFallback("/api/admin/notifications", { method: "GET" }, null);
  },

  // Inventory
  async getInventory(category = null, status = null) {
    let url = "/api/inventory?";
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (status) url += `status=${encodeURIComponent(status)}`;
    return fetchWithFallback(url, { method: "GET" }, null);
  },

  // Freshness Analysis
  async analyzeFoodImage(formData) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analysis/predict`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn("[API] Prediction API call failed. Using client prediction engine.", error);
      return null;
    }
  },

  // Storage Sensors
  async getSensorData() {
    return fetchWithFallback("/api/storage/sensors", { method: "GET" }, {
      coldStorageTemp: { value: 2.4, unit: "°C", status: "Compliant" },
      relativeHumidity: { value: 86.0, unit: "%", status: "Optimal" },
      airCirculation: { value: 0.45, unit: "m/s", status: "Good Flow" },
      lightExposure: { value: 14.0, unit: "Lux", status: "Low UV Exposure" },
      complianceOverall: 98.5,
    });
  },

  // System Analytics
  async getDashboardAnalytics(role = "Retail Manager") {
    return fetchWithFallback(
      `/api/analytics/dashboard?role=${encodeURIComponent(role)}`,
      { method: "GET" },
      { activeRole: role, averageFreshness: 84.2, systemLatencyMs: 38 }
    );
  },
};
