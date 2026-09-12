/**
 * Centralized API Service for Food Freshness Monitoring Platform ("Freshness Watch").
 * Communicates directly with the FastAPI backend (http://127.0.0.1:8000).
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function getAuthHeaders(isMultipart = false) {
  const token = localStorage.getItem("ffm-auth-token");
  const headers = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const isMultipart = options.body instanceof FormData;
  const headers = {
    ...getAuthHeaders(isMultipart),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.detail || `Request failed with status ${res.status}`;
      throw new Error(message);
    }
    if (res.status === 204) return null;
    return await res.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const apiService = {
  // -------------------------------------------------------------------------
  // Auth APIs
  // -------------------------------------------------------------------------
  async login(usernameOrEmail, password, role = "Consumer") {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: usernameOrEmail, password, role }),
    });

    if (data.access_token) {
      localStorage.setItem("ffm-auth-token", data.access_token);
    }
    return data.user;
  },

  async register(userData) {
    const payload = {
      name: userData.fullName || userData.name || userData.username,
      username: userData.username,
      email: userData.email,
      password: userData.password || "Password123!",
      role: userData.role || "Consumer",
      mobile: userData.mobile || null,
      gender: userData.gender || "Other",
    };

    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data.access_token) {
      localStorage.setItem("ffm-auth-token", data.access_token);
    }
    return data.user;
  },

  async adminLogin(adminUsername, password) {
    // Admin login reuses login endpoint and checks for admin role
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: adminUsername, password }),
    });

    if (data.access_token) {
      localStorage.setItem("ffm-auth-token", data.access_token);
    }
    return data.user;
  },

  async getMe() {
    return await request("/auth/me", { method: "GET" });
  },

  // -------------------------------------------------------------------------
  // Food Analysis APIs (Real ML Prediction)
  // -------------------------------------------------------------------------
  async quickAssess(formData) {
    // formData contains: image, name, category, storage_temperature_c, storage_humidity_pct
    return await request("/freshness/quick-assess", {
      method: "POST",
      body: formData,
    });
  },

  async getAnalyses(params = {}) {
    let url = "/analyses?";
    if (params.category && params.category !== "All") url += `category=${encodeURIComponent(params.category)}&`;
    if (params.risk_level && params.risk_level !== "All") url += `risk_level=${encodeURIComponent(params.risk_level)}&`;
    if (params.search) url += `search=${encodeURIComponent(params.search)}&`;
    return await request(url, { method: "GET" });
  },

  async getAnalysisById(id) {
    return await request(`/analyses/${id}`, { method: "GET" });
  },

  async deleteAnalysis(id) {
    return await request(`/analyses/${id}`, { method: "DELETE" });
  },

  // -------------------------------------------------------------------------
  // Inventory APIs
  // -------------------------------------------------------------------------
  async getInventory(params = {}) {
    let url = "/inventory?";
    if (params.category && params.category !== "All") url += `category=${encodeURIComponent(params.category)}&`;
    if (params.status && params.status !== "All") url += `status=${encodeURIComponent(params.status)}&`;
    if (params.search) url += `search=${encodeURIComponent(params.search)}&`;
    return await request(url, { method: "GET" });
  },

  async createInventoryItem(itemData) {
    return await request("/inventory", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  },

  async updateInventoryItem(id, itemData) {
    return await request(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  },

  async deleteInventoryItem(id) {
    return await request(`/inventory/${id}`, {
      method: "DELETE",
    });
  },

  // -------------------------------------------------------------------------
  // Notification APIs
  // -------------------------------------------------------------------------
  async getNotifications() {
    return await request("/notifications", { method: "GET" });
  },

  async markNotificationRead(id) {
    return await request(`/notifications/${id}/read`, { method: "PUT" });
  },

  async markAllNotificationsRead() {
    return await request("/notifications/read-all", { method: "POST" });
  },

  async deleteNotification(id) {
    return await request(`/notifications/${id}`, { method: "DELETE" });
  },

  // -------------------------------------------------------------------------
  // Analytics APIs
  // -------------------------------------------------------------------------
  async getAnalyticsSummary() {
    return await request("/analytics/summary", { method: "GET" });
  },

  // -------------------------------------------------------------------------
  // Admin & System Telemetry APIs
  // -------------------------------------------------------------------------
  async getAdminDashboard() {
    return await request("/admin/dashboard", { method: "GET" });
  },

  async getAdminUsers() {
    return await request("/admin/users", { method: "GET" });
  },

  async updateAdminUserStatus(userId, statusData) {
    return await request(`/admin/users/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    });
  },

  async deleteAdminUser(userId) {
    return await request(`/admin/users/${userId}`, { method: "DELETE" });
  },

  async getAdminLoginActivity() {
    return await request("/admin/login-activity", { method: "GET" });
  },

  async getUserLoginHistory() {
    return await request("/admin/login-activity", { method: "GET" });
  },

  async getAdminAnalyses(params = {}) {
    let url = "/admin/analyses?";
    if (params.category && params.category !== "All") url += `category=${encodeURIComponent(params.category)}&`;
    if (params.risk_level && params.risk_level !== "All") url += `risk_level=${encodeURIComponent(params.risk_level)}&`;
    if (params.search) url += `search=${encodeURIComponent(params.search)}&`;
    return await request(url, { method: "GET" });
  },

  async getSystemStatus() {
    return await request("/system/status", { method: "GET" });
  },

  async getModelStatus() {
    return await request("/freshness/model-status", { method: "GET" });
  },
};

