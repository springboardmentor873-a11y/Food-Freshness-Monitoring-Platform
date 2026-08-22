import { 
  FoodInventoryItem, 
  AnalysisResult, 
  StorageSensorData, 
  NotificationItem, 
  ReportItem, 
  ModelMetadata,
  User 
} from '../types';

export const DEMO_USERS: Record<string, User> = {
  consumer: {
    id: 'usr_consumer_01',
    name: 'Sarah Jenkins',
    email: 'demo.consumer@freshsense.ai',
    role: 'Consumer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    organization: 'Home Kitchen',
    createdAt: '2025-01-15'
  },
  retail: {
    id: 'usr_retail_02',
    name: 'Marcus Chen',
    email: 'demo.retail@freshsense.ai',
    role: 'Retail Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    organization: 'GreenMart Supermarkets',
    createdAt: '2024-11-20'
  },
  warehouse: {
    id: 'usr_warehouse_03',
    name: 'Elena Rostova',
    email: 'demo.warehouse@freshsense.ai',
    role: 'Warehouse Operator',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organization: 'Pacific Cold Chain Logistics',
    createdAt: '2024-09-10'
  },
  inspector: {
    id: 'usr_inspector_04',
    name: 'Dr. David Kim',
    email: 'demo.inspector@freshsense.ai',
    role: 'Food Quality Inspector',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    organization: 'AgriQuality Safety Authority',
    createdAt: '2024-06-01'
  },
  admin: {
    id: 'usr_admin_05',
    name: 'Alex Rivera',
    email: 'demo.admin@freshsense.ai',
    role: 'Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'FreshSense AI Core Team',
    createdAt: '2024-01-01'
  }
};

export const SAMPLE_PRESET_IMAGES = [
  {
    id: 'sample_tomato_fresh',
    name: 'Vine-Ripened Tomato',
    category: 'Vegetables' as const,
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    expectedFreshness: 'Fresh' as const,
    score: 94,
    description: 'Firm taut skin, deep crimson luster, zero blemishes.'
  },
  {
    id: 'sample_bellpepper_good',
    name: 'Crisp Bell Pepper',
    category: 'Vegetables' as const,
    url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80',
    expectedFreshness: 'Good' as const,
    score: 87,
    description: 'High gloss, firm stem, minor micro-wrinkles near base.'
  },
  {
    id: 'sample_spinach_acceptable',
    name: 'Baby Spinach Leaves',
    category: 'Vegetables' as const,
    url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    expectedFreshness: 'Acceptable' as const,
    score: 72,
    description: 'Slight edge wilting, moisture loss visible, still safe.'
  },
  {
    id: 'sample_banana_near_spoilage',
    name: 'Cavendish Bananas',
    category: 'Fruits' as const,
    url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    expectedFreshness: 'Near Spoilage' as const,
    score: 48,
    description: 'Heavy brown freckling, soft neck, rapid sugar breakdown.'
  },
  {
    id: 'sample_strawberry_spoiled',
    name: 'Cultivated Strawberries',
    category: 'Fruits' as const,
    url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    expectedFreshness: 'Spoiled' as const,
    score: 22,
    description: 'Surface fungal hyphae/mold growth, tissue maceration.'
  },
  {
    id: 'sample_broccoli_fresh',
    name: 'Organic Broccoli Crown',
    category: 'Vegetables' as const,
    url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80',
    expectedFreshness: 'Fresh' as const,
    score: 96,
    description: 'Tight dark green florets, crisp stem cut, vibrant chlorophyll.'
  }
];

export const INITIAL_ANALYSES: AnalysisResult[] = [
  {
    id: 'scan-1001',
    timestamp: '2026-08-22T08:30:00Z',
    foodName: 'Heirloom Vine Tomatoes',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    predictedClass: 'Fresh',
    confidence: 0.96,
    freshnessScore: 95,
    spoilageProbability: 0.04,
    qualityScore: 94,
    riskLevel: 'Low',
    remainingShelfLifeDays: 8,
    estimatedExpiryDate: '2026-08-30',
    probabilities: {
      Fresh: 0.96,
      Good: 0.03,
      Acceptable: 0.01,
      'Near Spoilage': 0.0,
      Spoiled: 0.0
    },
    breakdown: {
      visualCondition: 38.5, // max 40
      storageCondition: 24.0, // max 25
      shelfLifePrediction: 18.5, // max 20
      productAge: 14.0, // max 15
      totalScore: 95
    },
    spoilageIndicators: [
      {
        name: 'Color Degradation',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.98,
        description: 'Vibrant uniform red hue with no chlorosis or discoloration.'
      },
      {
        name: 'Surface Texture Changes',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.95,
        description: 'High epidermal turgidity; no surface pitting or shriveling.'
      },
      {
        name: 'Mold & Fungal Growth',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.99,
        description: 'Zero mycotoxic mycelium or fungal colonies observed.'
      },
      {
        name: 'Bruising & Soft Spots',
        status: 'Low',
        severity: 'low',
        confidence: 0.91,
        description: 'Tiny mechanical handling mark under calyx, negligible.'
      },
      {
        name: 'Physical Damage',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.97,
        description: 'Intact cuticle barrier protecting flesh against pathogens.'
      }
    ],
    recommendations: [
      {
        id: 'rec-01',
        title: 'Maintain Room Temperature Storage',
        category: 'Storage',
        priority: 'Medium',
        reason: 'Refrigeration below 10°C halts tomato volatile flavor enzymes.',
        expectedImpact: '+3 Days optimal flavor retention',
        actionText: 'Keep on counter away from direct sunlight'
      },
      {
        id: 'rec-02',
        title: 'Isolate from Ethylene-Heavy Fruits',
        category: 'Storage',
        priority: 'Low',
        reason: 'Ripe bananas or apples nearby accelerate softening.',
        expectedImpact: '+2 Days shelf stability',
        actionText: 'Separate fruit basket compartments'
      }
    ],
    environmentalContext: {
      temperature: 19.5,
      humidity: 62,
      packaging: 'Perforated Punnet',
      storageDays: 1
    },
    batchId: 'BATCH-2026-TOM-04',
    isDemo: false
  },
  {
    id: 'scan-1002',
    timestamp: '2026-08-21T14:15:00Z',
    foodName: 'Organic Baby Spinach',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    predictedClass: 'Acceptable',
    confidence: 0.89,
    freshnessScore: 68,
    spoilageProbability: 0.32,
    qualityScore: 70,
    riskLevel: 'Moderate',
    remainingShelfLifeDays: 2,
    estimatedExpiryDate: '2026-08-24',
    probabilities: {
      Fresh: 0.05,
      Good: 0.22,
      Acceptable: 0.62,
      'Near Spoilage': 0.10,
      Spoiled: 0.01
    },
    breakdown: {
      visualCondition: 27.0,
      storageCondition: 18.0,
      shelfLifePrediction: 13.0,
      productAge: 10.0,
      totalScore: 68
    },
    spoilageIndicators: [
      {
        name: 'Color Degradation',
        status: 'Moderate',
        severity: 'medium',
        confidence: 0.88,
        description: 'Chlorophyll breakdown starting at petiole margins.'
      },
      {
        name: 'Surface Texture Changes',
        status: 'Moderate',
        severity: 'medium',
        confidence: 0.86,
        description: 'Noticeable cell dehydration causing limp leaf texture.'
      },
      {
        name: 'Mold & Fungal Growth',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.96,
        description: 'No botrytis or slime colonies found.'
      },
      {
        name: 'Bruising & Soft Spots',
        status: 'Low',
        severity: 'low',
        confidence: 0.84,
        description: 'Compressive packaging crease on central leaves.'
      },
      {
        name: 'Physical Damage',
        status: 'Low',
        severity: 'low',
        confidence: 0.90,
        description: 'Minor stem bending.'
      }
    ],
    recommendations: [
      {
        id: 'rec-03',
        title: 'Priority Consumption / Cooking',
        category: 'Consumption',
        priority: 'High',
        reason: 'Leaves are losing crispness rapidly within 48 hours.',
        expectedImpact: '100% waste prevention if cooked today',
        actionText: 'Use in sauté, smoothie, or pasta sauce'
      },
      {
        id: 'rec-04',
        title: 'Paper Towel Moisture Absorption',
        category: 'Storage',
        priority: 'Medium',
        reason: 'Excess free condensation triggers bacterial leaf rot.',
        expectedImpact: '+1.5 Days extension',
        actionText: 'Insert dry paper towel in container'
      }
    ],
    environmentalContext: {
      temperature: 5.2,
      humidity: 84,
      packaging: 'Clamshell Plastic',
      storageDays: 4
    },
    batchId: 'BATCH-2026-SPN-12',
    isDemo: false
  },
  {
    id: 'scan-1003',
    timestamp: '2026-08-20T11:40:00Z',
    foodName: 'Crown Broccoli',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80',
    predictedClass: 'Good',
    confidence: 0.93,
    freshnessScore: 88,
    spoilageProbability: 0.12,
    qualityScore: 86,
    riskLevel: 'Low',
    remainingShelfLifeDays: 5,
    estimatedExpiryDate: '2026-08-27',
    probabilities: {
      Fresh: 0.35,
      Good: 0.58,
      Acceptable: 0.05,
      'Near Spoilage': 0.01,
      Spoiled: 0.01
    },
    breakdown: {
      visualCondition: 36.0,
      storageCondition: 22.0,
      shelfLifePrediction: 17.5,
      productAge: 12.5,
      totalScore: 88
    },
    spoilageIndicators: [
      {
        name: 'Color Degradation',
        status: 'Low',
        severity: 'low',
        confidence: 0.94,
        description: 'Deep emerald tone; tiny yellowing speckles on edge florets.'
      },
      {
        name: 'Surface Texture Changes',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.93,
        description: 'Tight, firm floret clusters.'
      },
      {
        name: 'Mold & Fungal Growth',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.99,
        description: 'Zero pathogen sign.'
      },
      {
        name: 'Bruising & Soft Spots',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.96,
        description: 'Solid stalk integrity.'
      },
      {
        name: 'Physical Damage',
        status: 'Not Detected',
        severity: 'low',
        confidence: 0.97,
        description: 'Clean stem cut.'
      }
    ],
    recommendations: [
      {
        id: 'rec-05',
        title: 'Chill at 1°C - 3°C with High Humidity',
        category: 'Storage',
        priority: 'Medium',
        reason: 'Broccoli respiration is lowered 4x near freezing temperatures.',
        expectedImpact: '+4 Days crispness',
        actionText: 'Place in crisper drawer sealed loosely'
      }
    ],
    environmentalContext: {
      temperature: 3.8,
      humidity: 90,
      packaging: 'Mesh Sleeve',
      storageDays: 2
    },
    batchId: 'BATCH-2026-BROC-08',
    isDemo: false
  }
];

export const INITIAL_INVENTORY: FoodInventoryItem[] = [
  {
    id: 'inv-001',
    name: 'Heirloom Vine Tomatoes',
    category: 'Vegetables',
    quantity: 45,
    unit: 'kg',
    batchId: 'BATCH-2026-TOM-04',
    purchaseDate: '2026-08-21',
    storageDate: '2026-08-21',
    expiryDate: '2026-08-30',
    storageLocation: 'Section A - Bay 3 (Dry Ambient)',
    temperature: 19.5,
    humidity: 62,
    packaging: 'Vented Wooden Crates',
    freshnessScore: 95,
    freshnessCategory: 'Fresh',
    remainingDays: 8,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    notes: 'Premium grade harvest from Salinas Valley supplier.',
    lastInspected: '2026-08-22',
    status: 'In Stock'
  },
  {
    id: 'inv-002',
    name: 'Hydroponic English Cucumbers',
    category: 'Vegetables',
    quantity: 120,
    unit: 'units',
    batchId: 'BATCH-2026-CUC-19',
    purchaseDate: '2026-08-19',
    storageDate: '2026-08-19',
    expiryDate: '2026-08-26',
    storageLocation: 'Section B - Cold Room 1',
    temperature: 11.0,
    humidity: 88,
    packaging: 'Shrink Wrapped',
    freshnessScore: 84,
    freshnessCategory: 'Good',
    remainingDays: 4,
    imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&auto=format&fit=crop&q=80',
    notes: 'Stable hydration, plastic wrap preserves moisture.',
    lastInspected: '2026-08-22',
    status: 'In Stock'
  },
  {
    id: 'inv-003',
    name: 'Organic Baby Spinach',
    category: 'Vegetables',
    quantity: 18,
    unit: 'boxes (5kg)',
    batchId: 'BATCH-2026-SPN-12',
    purchaseDate: '2026-08-17',
    storageDate: '2026-08-17',
    expiryDate: '2026-08-24',
    storageLocation: 'Section B - Cold Room 2',
    temperature: 5.2,
    humidity: 84,
    packaging: 'Clamshell Plastic',
    freshnessScore: 68,
    freshnessCategory: 'Acceptable',
    remainingDays: 2,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    notes: 'Approaching end of fresh window. Marked for FIFO rotation.',
    lastInspected: '2026-08-21',
    status: 'Expiring Soon'
  },
  {
    id: 'inv-004',
    name: 'Bell Peppers (Tricolor Pack)',
    category: 'Vegetables',
    quantity: 80,
    unit: 'packs',
    batchId: 'BATCH-2026-PEP-09',
    purchaseDate: '2026-08-20',
    storageDate: '2026-08-20',
    expiryDate: '2026-08-29',
    storageLocation: 'Section A - Bay 1',
    temperature: 8.5,
    humidity: 85,
    packaging: 'Perforated Polybags',
    freshnessScore: 91,
    freshnessCategory: 'Fresh',
    remainingDays: 7,
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80',
    notes: 'Excellent firm walls, high gloss.',
    lastInspected: '2026-08-22',
    status: 'In Stock'
  },
  {
    id: 'inv-005',
    name: 'Royal Gala Apples',
    category: 'Fruits',
    quantity: 250,
    unit: 'kg',
    batchId: 'BATCH-2026-APP-44',
    purchaseDate: '2026-08-15',
    storageDate: '2026-08-15',
    expiryDate: '2026-09-12',
    storageLocation: 'Section C - Controlled Atmosphere CA-2',
    temperature: 2.0,
    humidity: 92,
    packaging: 'Corrugated Trays',
    freshnessScore: 96,
    freshnessCategory: 'Fresh',
    remainingDays: 21,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    notes: 'Low ethylene chamber. Shelf stability outstanding.',
    lastInspected: '2026-08-20',
    status: 'In Stock'
  },
  {
    id: 'inv-006',
    name: 'Sweet Strawberries',
    category: 'Fruits',
    quantity: 35,
    unit: 'punnets',
    batchId: 'BATCH-2026-STR-03',
    purchaseDate: '2026-08-16',
    storageDate: '2026-08-16',
    expiryDate: '2026-08-22',
    storageLocation: 'Section B - Cold Shelf 4',
    temperature: 4.0,
    humidity: 78,
    packaging: 'Punched Punnet',
    freshnessScore: 38,
    freshnessCategory: 'Near Spoilage',
    remainingDays: 0,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    notes: 'Immediate mark-down or bakery puree transfer required.',
    lastInspected: '2026-08-22',
    status: 'Critical'
  },
  {
    id: 'inv-007',
    name: 'Crown Broccoli',
    category: 'Vegetables',
    quantity: 60,
    unit: 'kg',
    batchId: 'BATCH-2026-BROC-08',
    purchaseDate: '2026-08-18',
    storageDate: '2026-08-18',
    expiryDate: '2026-08-27',
    storageLocation: 'Section B - Cold Room 1',
    temperature: 3.8,
    humidity: 90,
    packaging: 'Mesh Sleeve',
    freshnessScore: 88,
    freshnessCategory: 'Good',
    remainingDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&auto=format&fit=crop&q=80',
    notes: 'Iced crate packing intact.',
    lastInspected: '2026-08-20',
    status: 'In Stock'
  }
];

export const INITIAL_STORAGE_SENSORS: StorageSensorData[] = [
  {
    id: 'sensor-01',
    location: 'Central Cold Vault A',
    zone: 'Zone 1 - Leafy Greens & Brassicas',
    temperature: 2.8,
    targetTemp: 3.0,
    humidity: 91,
    targetHumidity: 90,
    airCirculation: 'Optimal',
    lightExposure: 'Minimal',
    status: 'Optimal',
    complianceScore: 98,
    lastUpdated: '1 min ago',
    trends: [
      { time: '00:00', temp: 2.9, humidity: 90 },
      { time: '04:00', temp: 3.1, humidity: 89 },
      { time: '08:00', temp: 2.8, humidity: 91 },
      { time: '12:00', temp: 3.0, humidity: 92 },
      { time: '16:00', temp: 2.7, humidity: 90 },
      { time: '20:00', temp: 2.8, humidity: 91 }
    ]
  },
  {
    id: 'sensor-02',
    location: 'Controlled CA Chilling Bay B',
    zone: 'Zone 2 - Pome & Stone Fruits',
    temperature: 1.8,
    targetTemp: 2.0,
    humidity: 93,
    targetHumidity: 92,
    airCirculation: 'Optimal',
    lightExposure: 'Minimal',
    status: 'Optimal',
    complianceScore: 97,
    lastUpdated: 'Just now',
    trends: [
      { time: '00:00', temp: 1.9, humidity: 92 },
      { time: '04:00', temp: 2.0, humidity: 93 },
      { time: '08:00', temp: 1.8, humidity: 94 },
      { time: '12:00', temp: 1.9, humidity: 93 },
      { time: '16:00', temp: 1.7, humidity: 92 },
      { time: '20:00', temp: 1.8, humidity: 93 }
    ]
  },
  {
    id: 'sensor-03',
    location: 'Distribution Staging Dock',
    zone: 'Zone 3 - Dry Solanaceae & Roots',
    temperature: 18.9,
    targetTemp: 16.0,
    humidity: 74,
    targetHumidity: 65,
    airCirculation: 'Low',
    lightExposure: 'Moderate',
    status: 'Warning',
    complianceScore: 78,
    lastUpdated: '3 mins ago',
    trends: [
      { time: '00:00', temp: 16.5, humidity: 67 },
      { time: '04:00', temp: 16.8, humidity: 69 },
      { time: '08:00', temp: 17.5, humidity: 71 },
      { time: '12:00', temp: 19.2, humidity: 76 },
      { time: '16:00', temp: 19.0, humidity: 75 },
      { time: '20:00', temp: 18.9, humidity: 74 }
    ]
  },
  {
    id: 'sensor-04',
    location: 'Retail Backroom Buffer',
    zone: 'Zone 4 - Ambient Produce Staging',
    temperature: 21.4,
    targetTemp: 18.0,
    humidity: 82,
    targetHumidity: 70,
    airCirculation: 'Poor',
    lightExposure: 'High',
    status: 'Critical',
    complianceScore: 61,
    lastUpdated: '2 mins ago',
    trends: [
      { time: '00:00', temp: 18.2, humidity: 72 },
      { time: '04:00', temp: 19.0, humidity: 75 },
      { time: '08:00', temp: 20.4, humidity: 79 },
      { time: '12:00', temp: 22.0, humidity: 85 },
      { time: '16:00', temp: 21.8, humidity: 84 },
      { time: '20:00', temp: 21.4, humidity: 82 }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Urgent: Strawberries Near Spoilage',
    description: 'Batch BATCH-2026-STR-03 has dropped to score 38 (0 shelf-life days left). Immediate discount or disposal advised.',
    timestamp: '15 minutes ago',
    category: 'Spoilage Alert',
    severity: 'critical',
    read: false,
    actionUrl: '/inventory',
    actionText: 'Manage Batch'
  },
  {
    id: 'notif-2',
    title: 'Zone 4 Temperature Warning',
    description: 'Retail Backroom Buffer exceeded 21°C threshold (current: 21.4°C). Check HVAC fan unit.',
    timestamp: '42 minutes ago',
    category: 'Storage Condition Alert',
    severity: 'warning',
    read: false,
    actionUrl: '/storage',
    actionText: 'View Sensors'
  },
  {
    id: 'notif-3',
    title: 'Baby Spinach FIFO Trigger',
    description: '18 boxes of Baby Spinach expiring in 48 hours. Promote to front retail displays today.',
    timestamp: '2 hours ago',
    category: 'Shelf-Life Warning',
    severity: 'warning',
    read: false,
    actionUrl: '/recommendations',
    actionText: 'View Rotation Plan'
  },
  {
    id: 'notif-4',
    title: 'Weekly Quality Audit Passed',
    description: 'Warehouse cold chain compliance reached 97.4% average across all vegetable bays.',
    timestamp: '1 day ago',
    category: 'System Notification',
    severity: 'success',
    read: true,
    actionUrl: '/reports',
    actionText: 'Download Audit'
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-001',
    title: 'Comprehensive Freshness & Spoilage Audit - August 2026',
    type: 'Freshness Report',
    generatedDate: '2026-08-22',
    dateRange: '2026-08-01 to 2026-08-22',
    generatedBy: 'FreshSense Automated Telemetry',
    format: 'PDF',
    fileSize: '2.4 MB',
    summary: {
      totalScanned: 842,
      avgFreshness: 89.4,
      spoilageRate: 3.2,
      wasteAvertedKg: 1420
    }
  },
  {
    id: 'rep-002',
    title: 'Cold Storage Environmental Compliance Log',
    type: 'Storage Compliance Report',
    generatedDate: '2026-08-21',
    dateRange: 'Past 30 Days',
    generatedBy: 'Elena Rostova (Warehouse)',
    format: 'CSV',
    fileSize: '840 KB',
    summary: {
      totalScanned: 120,
      avgFreshness: 92.1,
      spoilageRate: 1.8,
      wasteAvertedKg: 2150
    }
  },
  {
    id: 'rep-003',
    title: 'Retail Shelf-Life Decay & FIFO Efficiency Analysis',
    type: 'Shelf-Life Report',
    generatedDate: '2026-08-19',
    dateRange: 'Q3-2026 MTD',
    generatedBy: 'Marcus Chen (Retail)',
    format: 'PDF',
    fileSize: '1.9 MB',
    summary: {
      totalScanned: 450,
      avgFreshness: 86.8,
      spoilageRate: 4.1,
      wasteAvertedKg: 890
    }
  },
  {
    id: 'rep-004',
    title: 'Food Waste Reduction & ESG Sustainability Metric',
    type: 'Waste Reduction Report',
    generatedDate: '2026-08-15',
    dateRange: 'Past 90 Days',
    generatedBy: 'FreshSense Analytics Service',
    format: 'PDF',
    fileSize: '3.1 MB',
    summary: {
      totalScanned: 2490,
      avgFreshness: 90.2,
      spoilageRate: 2.6,
      wasteAvertedKg: 5680
    }
  }
];

export const DEFAULT_MODEL_METADATA: ModelMetadata = {
  modelName: 'FreshSense-Vision-Net-v3.1',
  version: '3.1.4-multimodal-hybrid',
  status: 'Active',
  framework: 'TensorFlow 2.15 / Gemini 3.1 Pro High-Thinking Vision Pipeline',
  lastTrained: '2026-08-10',
  datasetSize: '48,600 validated food spoilage image samples',
  supportedCategories: [
    'Vegetables (Solanaceae, Brassicas, Alliums, Leafy Greens)',
    'Fruits (Pome, Berries, Citrus, Tropicals)'
  ],
  plannedCategories: [
    'Dairy Products (Texture & Separation analysis)',
    'Meat & Poultry (Myoglobin & Surface Sheen analysis)',
    'Seafood (Gill & Pupil clarity analysis)',
    'Bakery Products (Crumb & Surface mold analysis)'
  ],
  metrics: {
    accuracy: 0.942,
    valAccuracy: 0.928,
    loss: 0.142,
    avgLatencyMs: 240
  },
  mode: 'Gemini Vision AI'
};

export const INITIAL_RECOMMENDATIONS = [
  {
    id: 'rec-01',
    title: 'Promote Strawberries to Front-of-Shelf Displays',
    category: 'Inventory Rotation' as const,
    type: 'Inventory Rotation',
    priority: 'Critical' as const,
    reason: 'Batch BATCH-2026-STR-03 has 0 days of calculated shelf life remaining. Immediate fast-turnover placement required to prevent shrinkage.',
    expectedImpact: 'Prevents 100% loss of remaining 35 punnets ($140 value).',
    actionText: 'Execute Front-Display Mark'
  },
  {
    id: 'rec-02',
    title: 'Calibrate Cold Vault Zone 4 Relative Humidity',
    category: 'Storage' as const,
    type: 'Storage Recommendation',
    priority: 'High' as const,
    reason: 'Ambient buffer area humidity elevated to 82% (threshold 70%). High risk of mold spore proliferation on leafy brassicas.',
    expectedImpact: 'Extends ambient inventory shelf-life by 2.4 days.',
    actionText: 'Adjust Dehumidifier Target'
  },
  {
    id: 'rec-03',
    title: 'Prepare Baby Spinach for Bulk Salad Prep',
    category: 'Consumption' as const,
    type: 'Consumption Priority',
    priority: 'High' as const,
    reason: 'Hydroponic Spinach leaves entering 48-hour wilting window with 68/100 freshness index.',
    expectedImpact: 'Zero kitchen discard; transforms 18kg into fresh salad specials.',
    actionText: 'Dispatch to Kitchen Queue'
  },
  {
    id: 'rec-04',
    title: 'Separate High-Ethylene Bananas from Pome Fruit Bay',
    category: 'Storage' as const,
    type: 'Storage Recommendation',
    priority: 'Medium' as const,
    reason: 'Cavendish bananas in Chamber B emitting elevated C2H4 gas, accelerating adjacent Royal Gala apple respiration rate.',
    expectedImpact: 'Slows apple softening kinetics by up to 35%.',
    actionText: 'Re-slot to Ethylene-Vented Bay'
  },
  {
    id: 'rec-05',
    title: 'Implement 30% Dynamic Markdown on Heirloom Tomatoes',
    category: 'Waste Reduction' as const,
    type: 'Waste Reduction',
    priority: 'Medium' as const,
    reason: 'Stock level at 45kg with 3 days remaining before soft rot risk increases.',
    expectedImpact: 'Increases purchase velocity by 65%, avoiding food waste penalty.',
    actionText: 'Push Digital Price Tag Update'
  },
  {
    id: 'rec-06',
    title: 'Switch Crown Broccoli to Iced Hydro-Cool Packing',
    category: 'Quality Improvement' as const,
    type: 'Quality Improvement',
    priority: 'Low' as const,
    reason: 'Maintaining floret turgidity and preventing chlorophyll yellowing during staging.',
    expectedImpact: 'Maintains Grade-A visual rating for an additional 4 days.',
    actionText: 'Order Slush-Ice Crating'
  }
];

