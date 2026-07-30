export const FRESHNESS_TREND = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  avgScore: [81, 83, 79, 85, 88, 86, 87],
  itemsAnalyzed: [42, 51, 38, 60, 55, 33, 47],
};

export const CATEGORY_BREAKDOWN = [
  { category: "Fruits", count: 312, color: "#10B981" },
  { category: "Vegetables", count: 268, color: "#14B8A6" },
  { category: "Dairy Products", count: 184, color: "#84CC16" },
  { category: "Meat & Poultry", count: 143, color: "#0D9488" },
  { category: "Seafood", count: 97, color: "#047857" },
  { category: "Bakery Products", count: 121, color: "#A3E635" },
  { category: "Packaged Foods", count: 89, color: "#065F46" },
  { category: "Beverages", count: 70, color: "#BEF264" },
];

export const SHELF_LIFE_BY_CATEGORY = {
  labels: ["Fruits", "Vegetables", "Dairy", "Meat", "Seafood", "Bakery"],
  avgDaysRemaining: [4.2, 5.1, 3.4, 1.8, 1.2, 2.6],
};

export const FRESHNESS_DISTRIBUTION = [
  { status: "Fresh", count: 452, color: "#10B981" },
  { status: "Good", count: 318, color: "#14B8A6" },
  { status: "Acceptable", count: 211, color: "#84CC16" },
  { status: "Near Spoilage", count: 94, color: "#F59E0B" },
  { status: "Spoiled", count: 38, color: "#F43F5E" },
];

export const ANALYTICS_SUMMARY = [
  { id: "analyzed", label: "Items Analyzed This Week", value: 326, delta: "+12.4%", trend: "up" },
  { id: "avgScore", label: "Avg. Freshness Score", value: 84, suffix: "%", delta: "+3.2%", trend: "up" },
  { id: "wasteRate", label: "Spoilage Rate", value: 3.4, suffix: "%", delta: "-1.1%", trend: "down" },
  { id: "alerts", label: "Alerts Triggered", value: 27, delta: "+4", trend: "down" },
];
