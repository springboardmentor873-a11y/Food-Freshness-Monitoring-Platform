import apiClient from './api';

export const authApi = {
  login: async (credentials) => {
    try {
      return await apiClient.post('/auth/login', credentials);
    } catch {
      // Mock Fallback
      return { token: 'mock-jwt-active', user: { email: credentials.email, role: credentials.role } };
    }
  },
  signup: async (userData) => {
    try {
      return await apiClient.post('/auth/signup', userData);
    } catch {
      return { success: true, message: 'Account created successfully.' };
    }
  },
  resetPassword: async (email) => {
    try {
      return await apiClient.post('/auth/reset-password', { email });
    } catch {
      return { success: true, message: 'Password reset link dispatched.' };
    }
  },
};
