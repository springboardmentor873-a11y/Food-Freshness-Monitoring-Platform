const CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy Products",
  "Meat & Poultry",
  "Seafood",
  "Bakery Products",
  "Packaged Foods",
  "Beverages",
];

const ITEM_TEMPLATES = [
  { name: "Organic Strawberries", category: "Fruits", unit: "kg" },
  { name: "Alphonso Mangoes", category: "Fruits", unit: "kg" },
  { name: "Roma Tomatoes", category: "Vegetables", unit: "kg" },
  { name: "Baby Spinach", category: "Vegetables", unit: "kg" },
  { name: "Whole Milk 1L", category: "Dairy Products", unit: "units" },
  { name: "Greek Yogurt Tub", category: "Dairy Products", unit: "units" },
  { name: "Chicken Breast", category: "Meat & Poultry", unit: "kg" },
  { name: "Ground Turkey", category: "Meat & Poultry", unit: "kg" },
  { name: "Atlantic Salmon Fillet", category: "Seafood", unit: "kg" },
  { name: "Tiger Prawns", category: "Seafood", unit: "kg" },
  { name: "Sourdough Loaf", category: "Bakery Products", unit: "units" },
  { name: "Croissants (6-pack)", category: "Bakery Products", unit: "packs" },
  { name: "Canned Chickpeas", category: "Packaged Foods", unit: "cans" },
  { name: "Basmati Rice 5kg", category: "Packaged Foods", unit: "bags" },
  { name: "Orange Juice 1L", category: "Beverages", unit: "units" },
  { name: "Sparkling Water 12-pack", category: "Beverages", unit: "packs" },
];

const STATUSES = ["Fresh", "Good", "Acceptable", "Near Spoilage", "Spoiled"];
const LOCATIONS = ["Warehouse A", "Warehouse B", "Retail Floor", "Cold Storage"];

function scoreForStatus(status) {
  const ranges = {
    Fresh: [86, 99],
    Good: [70, 85],
    Acceptable: [50, 69],
    "Near Spoilage": [25, 49],
    Spoiled: [2, 24],
  };
  const [min, max] = ranges[status];
  return Math.floor(min + Math.random() * (max - min));
}

function generateInventory(count = 24) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const template = ITEM_TEMPLATES[i % ITEM_TEMPLATES.length];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const receivedDaysAgo = Math.floor(Math.random() * 10) + 1;
    const shelfLifeDays = status === "Spoiled" ? 0 : Math.floor(Math.random() * 10) + 1;

    const receivedDate = new Date();
    receivedDate.setDate(receivedDate.getDate() - receivedDaysAgo);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);

    items.push({
      id: `inv-${1000 + i}`,
      batchId: `BT-${2200 + i * 3}`,
      name: template.name,
      category: template.category,
      unit: template.unit,
      quantity: Math.floor(Math.random() * 40) + 5,
      freshnessScore: scoreForStatus(status),
      freshnessCategory: status,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      receivedDate: receivedDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      shelfLifeDays,
      storage: {
        temperature: "1-4°C",
        humidity: "80-90%",
      },
    });
  }
  return items;
}

export const INVENTORY_ITEMS = generateInventory(24);
export const INVENTORY_CATEGORIES = CATEGORIES;
export const INVENTORY_STATUSES = STATUSES;
