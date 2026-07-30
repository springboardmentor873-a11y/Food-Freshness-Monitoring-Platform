export const DASHBOARD_STATS = [
  { id: "items", label: "Items Tracked", value: 1284, delta: "+8.2%", trend: "up" },
  { id: "avgScore", label: "Avg. Freshness Score", value: 87, suffix: "%", delta: "+2.1%", trend: "up" },
  { id: "atRisk", label: "At-Risk Batches", value: 14, delta: "-5", trend: "down" },
  { id: "wasteSaved", label: "Waste Reduced", value: 312, suffix: " kg", delta: "+18%", trend: "up" },
];

export const RECENT_ACTIVITY = [
  { id: 1, item: "Organic Strawberries", batch: "BT-2291", status: "Fresh", time: "2 minutes ago" },
  { id: 2, item: "Whole Milk 1L", batch: "BT-2288", status: "Near Spoilage", time: "18 minutes ago" },
  { id: 3, item: "Atlantic Salmon Fillet", batch: "BT-2285", status: "Good", time: "42 minutes ago" },
  { id: 4, item: "Sourdough Loaf", batch: "BT-2279", status: "Acceptable", time: "1 hour ago" },
  { id: 5, item: "Roma Tomatoes", batch: "BT-2271", status: "Spoiled", time: "3 hours ago" },
];

export const STATUS_COLORS = {
  Fresh: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Good: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  Acceptable: "bg-lime-100 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400",
  "Near Spoilage": "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Spoiled: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};
