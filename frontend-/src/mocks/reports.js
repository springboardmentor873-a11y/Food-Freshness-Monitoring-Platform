import { INVENTORY_ITEMS } from "./inventory";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export const REPORT_TYPES = [
  {
    id: "freshness",
    label: "Freshness Report",
    description: "Freshness score and status for every tracked batch.",
    columns: [
      { key: "name", label: "Item" },
      { key: "category", label: "Category" },
      { key: "batchId", label: "Batch ID" },
      { key: "freshnessScore", label: "Score" },
      { key: "freshnessCategory", label: "Status" },
    ],
    buildRows: (items) =>
      items.map((i) => ({
        name: i.name,
        category: i.category,
        batchId: i.batchId,
        freshnessScore: i.freshnessScore,
        freshnessCategory: i.freshnessCategory,
      })),
  },
  {
    id: "shelfLife",
    label: "Shelf-Life Report",
    description: "Remaining shelf life and projected expiry per batch.",
    columns: [
      { key: "name", label: "Item" },
      { key: "batchId", label: "Batch ID" },
      { key: "shelfLifeDays", label: "Days Remaining" },
      { key: "expiryDate", label: "Expiry Date" },
    ],
    buildRows: (items) =>
      items.map((i) => ({
        name: i.name,
        batchId: i.batchId,
        shelfLifeDays: i.shelfLifeDays,
        expiryDate: formatDate(i.expiryDate),
      })),
  },
  {
    id: "inventoryQuality",
    label: "Inventory Quality Report",
    description: "Quantity on hand and quality status by item.",
    columns: [
      { key: "name", label: "Item" },
      { key: "category", label: "Category" },
      { key: "quantity", label: "Quantity" },
      { key: "unit", label: "Unit" },
      { key: "freshnessCategory", label: "Status" },
    ],
    buildRows: (items) =>
      items.map((i) => ({
        name: i.name,
        category: i.category,
        quantity: i.quantity,
        unit: i.unit,
        freshnessCategory: i.freshnessCategory,
      })),
  },
  {
    id: "wasteReduction",
    label: "Waste Reduction Report",
    description: "Spoiled batch counts aggregated by category.",
    columns: [
      { key: "category", label: "Category" },
      { key: "totalBatches", label: "Total Batches" },
      { key: "spoiledBatches", label: "Spoiled Batches" },
      { key: "spoilageRate", label: "Spoilage Rate" },
    ],
    buildRows: (items) => {
      const byCategory = {};
      items.forEach((i) => {
        byCategory[i.category] ??= { total: 0, spoiled: 0 };
        byCategory[i.category].total += 1;
        if (i.freshnessCategory === "Spoiled") byCategory[i.category].spoiled += 1;
      });
      return Object.entries(byCategory).map(([category, v]) => ({
        category,
        totalBatches: v.total,
        spoiledBatches: v.spoiled,
        spoilageRate: `${Math.round((v.spoiled / v.total) * 100)}%`,
      }));
    },
  },
  {
    id: "storageCompliance",
    label: "Storage Compliance Report",
    description: "Storage conditions and location per batch.",
    columns: [
      { key: "name", label: "Item" },
      { key: "batchId", label: "Batch ID" },
      { key: "location", label: "Location" },
      { key: "temperature", label: "Temperature" },
      { key: "humidity", label: "Humidity" },
    ],
    buildRows: (items) =>
      items.map((i) => ({
        name: i.name,
        batchId: i.batchId,
        location: i.location,
        temperature: i.storage.temperature,
        humidity: i.storage.humidity,
      })),
  },
];

/**
 * generateReport — filters the shared inventory mock by category/date range
 * and builds rows for the selected report type. Replace with
 * reportService.generateReport(params) once FastAPI is live — the
 * {columns, rows} shape returned here is what that endpoint should match.
 */
export function generateReport(typeId, { category = "All", from, to } = {}) {
  const type = REPORT_TYPES.find((t) => t.id === typeId);
  if (!type) return { columns: [], rows: [] };

  let items = INVENTORY_ITEMS;
  if (category !== "All") items = items.filter((i) => i.category === category);
  if (from) items = items.filter((i) => new Date(i.receivedDate) >= new Date(from));
  if (to) items = items.filter((i) => new Date(i.receivedDate) <= new Date(to));

  return { columns: type.columns, rows: type.buildRows(items) };
}
