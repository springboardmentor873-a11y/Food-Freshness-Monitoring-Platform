import { apiClient, clearTokens, storeTokens } from "./api";

export async function registerUser(payload) {
  const { data } = await apiClient.post("/api/v1/auth/register", payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await apiClient.post("/api/v1/auth/login", payload);
  storeTokens(data);
  return data.user;
}

export async function loginWithGoogle(payload) {
  const { data } = await apiClient.post("/api/v1/auth/google", payload);
  storeTokens(data);
  return data.user;
}


export async function getCurrentUser() {
  const { data } = await apiClient.get("/api/v1/auth/me");
  return data;
}

export async function logoutUser() {
  const refreshToken = localStorage.getItem("food_freshness_refresh_token");
  try {
    if (refreshToken) {
      await apiClient.post("/api/v1/auth/logout", { refresh_token: refreshToken });
    }
  } finally {
    clearTokens();
  }
}

export async function updateUserProfile(payload) {
  const { data } = await apiClient.patch("/api/v1/auth/me", payload);
  return data;
}

export async function changePassword(payload) {
  await apiClient.post("/api/v1/auth/change-password", payload);
}

export async function forgotPassword(email) {
  const { data } = await apiClient.post("/api/v1/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(payload) {
  await apiClient.post("/api/v1/auth/reset-password", payload);
}

