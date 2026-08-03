import apiClient from './api';
import { MOCK_INVENTORY, MOCK_TELEMETRY, MOCK_SYSTEM_HEALTH } from '../constants/mockData';

export const inventoryApi = {
  getAll: async (params) => {
    try {
      return await apiClient.get('/inventory', { params });
    } catch {
      return MOCK_INVENTORY;
    }
  },
  getById: async (id) => {
    try {
      return await apiClient.get(`/inventory/${id}`);
    } catch {
      return MOCK_INVENTORY.find((item) => item.id === id) || MOCK_INVENTORY[0];
    }
  },
  create: async (item) => {
    try {
      return await apiClient.post('/inventory', item);
    } catch {
      return { success: true, item };
    }
  },
  delete: async (id) => {
    try {
      return await apiClient.delete(`/inventory/${id}`);
    } catch {
      return { success: true, id };
    }
  },
};

export const analysisApi = {
  analyzeImage: async (formData) => {
    try {
      return await apiClient.post('/ai/analyze-freshness', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch {
      // Return realistic AI prediction mock
      return {
        detectedFood: 'Organic Cavendish Banana',
        category: 'Fruits',
        confidence: 98.4,
        freshnessScore: 92,
        spoilageProbability: 1.6,
        visualIndicators: {
          colorScore: 94,
          textureScore: 90,
          moldRisk: 0.2,
          bruisingRisk: 2.1,
          physicalDamage: 'Minimal stem creasing',
        },
        estimatedShelfLifeDays: 5,
        qualityGrade: 'FRESH',
        recommendation: 'Optimal condition for retail distribution. Recommended storage temp 13-14°C.',
      };
    }
  },
};

export const dashboardApi = {
  getTelemetry: async () => {
    try {
      return await apiClient.get('/telemetry/live');
    } catch {
      return MOCK_TELEMETRY;
    }
  },
  getSystemMetrics: async () => {
    try {
      return await apiClient.get('/admin/system-health');
    } catch {
      return MOCK_SYSTEM_HEALTH;
    }
  },
};

export const reportApi = {
  generateReport: async (filters) => {
    try {
      return await apiClient.post('/reports/generate', filters);
    } catch {
      return {
        reportId: 'RPT-2026-0881',
        title: `Freshness Audit Report (${filters?.category || 'All Categories'})`,
        downloadUrl: '#',
        createdAt: new Date().toISOString(),
        fileSize: '4.2 MB',
      };
    }
  },
};

export const notificationApi = {
  getNotifications: async () => {
    try {
      return await apiClient.get('/notifications');
    } catch {
      return [];
    }
  },
};
