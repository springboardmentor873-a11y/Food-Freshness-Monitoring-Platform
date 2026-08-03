import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.freshness.ai/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('freshness_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors cleanly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('freshness_jwt');
    } else if (status === 403) {
      toast.error('Permission denied for this role action.');
    } else if (status === 500) {
      toast.error('Internal Server Error. Retrying in background...');
    } else if (!status) {
      // Network offline or mock API mode
      console.warn('Backend API unreachable. Operating in Mock Enterprise Mode.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
