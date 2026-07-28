import { DashboardStats, InventoryItem, Prediction, ChartDataPoint } from '../types';

export const mockDashboardStats: DashboardStats = {
  totalFruits: 12450,
  freshFruits: 9820,
  nearSpoiled: 1450,
  spoiledFruits: 1180,
  averageFreshnessScore: 82,
  avgShelfLifeRemaining: 7.5,
};

export const mockInventory: InventoryItem[] = [
  {
    id: 'INV-001',
    fruitName: 'Granny Smith Apples',
    category: 'Apples',
    dateAdded: '2023-10-15',
    expiryDate: '2023-11-20',
    freshnessScore: 92,
    status: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&q=80',
  },
  {
    id: 'INV-002',
    fruitName: 'Cavendish Bananas',
    category: 'Bananas',
    dateAdded: '2023-10-20',
    expiryDate: '2023-10-27',
    freshnessScore: 45,
    status: 'Near Spoiled',
    imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&q=80',
  },
  {
    id: 'INV-003',
    fruitName: 'Hass Avocados',
    category: 'Avocados',
    dateAdded: '2023-10-22',
    expiryDate: '2023-10-30',
    freshnessScore: 78,
    status: 'Good',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80',
  },
  {
    id: 'INV-004',
    fruitName: 'Strawberries',
    category: 'Berries',
    dateAdded: '2023-10-24',
    expiryDate: '2023-10-28',
    freshnessScore: 88,
    status: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80',
  },
  {
    id: 'INV-005',
    fruitName: 'Navel Oranges',
    category: 'Citrus',
    dateAdded: '2023-10-10',
    expiryDate: '2023-11-15',
    freshnessScore: 95,
    status: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=300&q=80',
  },
  {
    id: 'INV-006',
    fruitName: 'Peaches',
    category: 'Stone Fruit',
    dateAdded: '2023-10-18',
    expiryDate: '2023-10-25',
    freshnessScore: 32,
    status: 'Spoiled',
    imageUrl: 'https://images.unsplash.com/photo-1533575990263-0f496357d726?w=300&q=80',
  }
];

export const mockChartData: ChartDataPoint[] = [
  { name: 'Jan', fresh: 4000, spoiled: 240 },
  { name: 'Feb', fresh: 3000, spoiled: 139 },
  { name: 'Mar', fresh: 2000, spoiled: 980 },
  { name: 'Apr', fresh: 2780, spoiled: 390 },
  { name: 'May', fresh: 1890, spoiled: 480 },
  { name: 'Jun', fresh: 2390, spoiled: 380 },
  { name: 'Jul', fresh: 3490, spoiled: 430 },
];

export const dummyPrediction: Prediction = {
  id: 'PRD-7829',
  imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&q=80',
  fruitName: 'Granny Smith Apple',
  confidenceScore: 98.5,
  freshnessScore: 87,
  status: 'Good',
  remainingShelfLifeDays: 14,
  spoilageProbability: 12,
  storageRecommendation: 'Store in crisper drawer of refrigerator',
  temperatureRecommendation: '1-3°C (34-37°F)',
  humidityRecommendation: '90-95% Relative Humidity',
  aiInsights: 'Skin shows minor bruising but flesh integrity remains high. Ethylene production is normal. Expected to ripen slowly if kept in cold storage.',
  date: new Date().toISOString(),
};
