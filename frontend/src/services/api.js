import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const ACCESS_TOKEN_KEY = "food_freshness_access_token";
const REFRESH_TOKEN_KEY = "food_freshness_refresh_token";

export const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeTokens({ access_token, refresh_token }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const refreshToken = getRefreshToken();
    const isAuthRequest = request?.url?.startsWith("/api/v1/auth/");
    if (error.response?.status !== 401 || request?._retry || !refreshToken || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retry = true;
    refreshPromise ??= apiClient.post("/api/v1/auth/refresh", { refresh_token: refreshToken })
      .then(({ data }) => {
        storeTokens(data);
        return data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });

    try {
      const accessToken = await refreshPromise;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(request);
    } catch (refreshError) {
      clearTokens();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(refreshError);
    }
  },
);
