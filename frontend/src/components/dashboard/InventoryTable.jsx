const inventoryItems = [
  {
    id: 1,
    image: "🍓",
    name: "Organic Strawberries",
    sku: "FRU-STR-092",
    category: "Produce",
    quantity: "450 Units",
    unit: "Cases",
    expiry: "Oct 24",
    days: "In 3 days",
    freshness: 82,
    status: "Near Expiry",
    statusColor: "red",
  },
  {
    id: 2,
    image: "🥛",
    name: "Pasteurized Whole Milk",
    sku: "DAI-MILK-201",
    category: "Dairy",
    quantity: "1,200 L",
    unit: "Bottles",
    expiry: "Oct 30",
    days: "In 9 days",
    freshness: 96,
    status: "In Stock",
    statusColor: "green",
  },
  {
    id: 3,
    image: "🥬",
    name: "Fresh Lettuce",
    sku: "VEG-LET-102",
    category: "Produce",
    quantity: "280 Units",
    unit: "Boxes",
    expiry: "Oct 26",
    days: "In 5 days",
    freshness: 91,
    status: "In Stock",
    statusColor: "green",
  },
  {
    id: 4,
    image: "🥩",
    name: "Premium Chicken",
    sku: "MEA-CHK-801",
    category: "Meat",
    quantity: "180 Units",
    unit: "Packs",
    expiry: "Tomorrow",
    days: "Urgent",
    freshness: 68,
    status: "Critical",
    statusColor: "red",
  },
];

function InventoryTable() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

      {/* Table Header */}
      <div className="grid grid-cols-8 border-b bg-gray-50 px-8 py-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
        <div></div>
        <div>Product Info</div>
        <div>Category</div>
        <div>Quantity</div>
        <div>Expiry</div>
        <div>Freshness Index</div>
        <div>Status</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Rows */}

      {inventoryItems.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-8 items-center border-b px-8 py-6"
        >

          {/* Checkbox */}
          <div>
            <input type="checkbox" />
          </div>

          {/* Product */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-3xl">
              {item.image}
            </div>

            <div>
              <h3 className="font-semibold">{item.name}</h3>

              <p className="text-sm text-gray-500">
                SKU: {item.sku}
              </p>
            </div>
          </div>

          {/* Category */}
          <div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {item.category}
            </span>
          </div>

          {/* Quantity */}
          <div>
            <p className="font-semibold">
              {item.quantity}
            </p>

            <p className="text-sm text-gray-500">
              {item.unit}
            </p>
          </div>

          {/* Expiry */}
          <div>
            <p className="font-semibold">
              {item.expiry}
            </p>

            <p className="text-sm text-red-500">
              {item.days}
            </p>
          </div>

          {/* Freshness */}
          <div>
            <p className="mb-2 font-semibold text-green-600">
              {item.freshness}%
            </p>

            <div className="h-2 w-28 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${item.freshness}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                item.statusColor === "green"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {item.status}
            </span>
          </div>

          {/* Actions */}
          <div className="text-right">
            <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
              View
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}

export default InventoryTable;