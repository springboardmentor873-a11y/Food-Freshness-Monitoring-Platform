export type UserRole = 
  | 'Consumer' 
  | 'Retail Manager' 
  | 'Warehouse Operator' 
  | 'Food Quality Inspector' 
  | 'Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organization?: string;
  createdAt: string;
}

export type FoodCategory = 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Dairy Products' 
  | 'Meat & Poultry' 
  | 'Seafood' 
  | 'Bakery Products' 
  | 'Packaged Foods' 
  | 'Beverages';

export type FreshnessCategory = 
  | 'Fresh' 
  | 'Good' 
  | 'Acceptable' 
  | 'Near Spoilage' 
  | 'Spoiled';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface SpoilageIndicator {
  name: string;
  status: 'Not Detected' | 'Low' | 'Moderate' | 'High' | 'Severe';
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
}

export interface QualityScoreBreakdown {
  visualCondition: number; // 40% weight
  storageCondition: number; // 25% weight
  shelfLifePrediction: number; // 20% weight
  productAge: number; // 15% weight
  totalScore: number;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: 'Storage' | 'Consumption' | 'Inventory Rotation' | 'Waste Reduction' | 'Quality Improvement';
  type?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent' | 'Critical';
  reason: string;
  expectedImpact: string;
  actionText: string;
  implemented?: boolean;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  foodName: string;
  category: FoodCategory;
  imageUrl: string;
  predictedClass: FreshnessCategory;
  confidence: number; // 0 to 1
  freshnessScore: number; // 0 to 100
  spoilageProbability: number; // 0 to 1
  qualityScore: number; // 0 to 100
  riskLevel: RiskLevel;
  remainingShelfLifeDays: number;
  estimatedExpiryDate: string;
  probabilities: Record<FreshnessCategory, number>;
  breakdown: QualityScoreBreakdown;
  spoilageIndicators: SpoilageIndicator[];
  recommendations: RecommendationItem[];
  environmentalContext?: {
    temperature: number; // in °C
    humidity: number; // in %
    packaging: string;
    storageDays: number;
  };
  isDemo?: boolean;
  notes?: string;
  batchId?: string;
}

export interface FoodInventoryItem {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  batchId: string;
  purchaseDate: string;
  storageDate: string;
  expiryDate: string;
  storageLocation: string;
  temperature: number;
  humidity: number;
  packaging: string;
  freshnessScore: number;
  freshnessCategory: FreshnessCategory;
  remainingDays: number;
  imageUrl: string;
  notes?: string;
  lastInspected?: string;
  status: 'In Stock' | 'Expiring Soon' | 'Expired' | 'Critical' | 'Consumed';
}

export interface StorageSensorData {
  id: string;
  location: string;
  zone: string;
  temperature: number;
  targetTemp: number;
  humidity: number;
  targetHumidity: number;
  airCirculation: 'Optimal' | 'Low' | 'Poor';
  lightExposure: 'Minimal' | 'Moderate' | 'High';
  status: 'Optimal' | 'Warning' | 'Critical';
  complianceScore: number;
  lastUpdated: string;
  trends: { time: string; temp: number; humidity: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'Freshness Alert' | 'Shelf-Life Warning' | 'Spoilage Alert' | 'Storage Condition Alert' | 'Inventory Alert' | 'System Notification';
  severity: 'info' | 'warning' | 'critical' | 'success';
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Freshness Report' | 'Shelf-Life Report' | 'Inventory Quality Report' | 'Waste Reduction Report' | 'Storage Compliance Report';
  generatedDate: string;
  dateRange: string;
  generatedBy: string;
  format: 'PDF' | 'CSV' | 'JSON';
  fileSize: string;
  summary: {
    totalScanned: number;
    avgFreshness: number;
    spoilageRate: number;
    wasteAvertedKg: number;
  };
}

export interface ModelMetadata {
  modelName: string;
  version: string;
  status: 'Active' | 'Training' | 'Degraded' | 'Offline';
  framework: string;
  lastTrained: string;
  datasetSize: string;
  supportedCategories: string[];
  plannedCategories: string[];
  metrics: {
    accuracy: number | null;
    valAccuracy: number | null;
    loss: number | null;
    avgLatencyMs: number;
  };
  mode: 'Gemini Vision AI' | 'TensorFlow Local ML' | 'Demo Mode';
}

export interface SystemStats {
  totalAnalyses: number;
  totalUsers: number;
  activeInventoryCount: number;
  avgFreshnessScore: number;
  atRiskCount: number;
  wasteReductionPercentage: number;
  apiHealth: 'Healthy' | 'Degraded' | 'Offline';
  latencyMs: number;
}
