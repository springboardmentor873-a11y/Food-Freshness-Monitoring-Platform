export type FreshnessStatus = 'Fresh' | 'Good' | 'Acceptable' | 'Near Spoiled' | 'Spoiled';

export interface Prediction {
  id: string;
  imageUrl: string;
  fruitName: string;
  confidenceScore: number;
  freshnessScore: number;
  status: FreshnessStatus;
  remainingShelfLifeDays: number;
  spoilageProbability: number;
  storageRecommendation: string;
  temperatureRecommendation: string;
  humidityRecommendation: string;
  aiInsights: string;
  date: string;
}

export interface InventoryItem {
  id: string;
  fruitName: string;
  category: string;
  dateAdded: string;
  expiryDate: string;
  freshnessScore: number;
  status: FreshnessStatus;
  imageUrl: string;
}

export interface DashboardStats {
  totalFruits: number;
  freshFruits: number;
  nearSpoiled: number;
  spoiledFruits: number;
  averageFreshnessScore: number;
  avgShelfLifeRemaining: number;
}

export interface ChartDataPoint {
  name: string;
  fresh: number;
  spoiled: number;
}
