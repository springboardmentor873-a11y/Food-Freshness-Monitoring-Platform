import { Edit2, Trash2 } from "lucide-react";
import EmptyState from "../ui/EmptyState";

function InventoryTable({
  items,
  loading,
  onEdit,
  onDelete,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) {
  const isAllSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
      {/* Table Header */}
      <div className="grid grid-cols-12 border-b bg-slate-50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 items-center">
        <div className="col-span-1 flex items-center justify-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            disabled={items.length === 0}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
        <div className="col-span-3">Product Info</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Quantity & Storage</div>
        <div className="col-span-2">Expiry Date</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center px-6 py-5 animate-pulse"
            >
              <div className="col-span-1 flex justify-center">
                <div className="h-4 w-4 rounded bg-slate-200" />
              </div>
              <div className="col-span-3 flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
              </div>
              <div className="col-span-2">
                <div className="h-6 w-20 rounded-full bg-slate-200" />
              </div>
              <div className="col-span-2">
                <div className="h-4 w-16 rounded bg-slate-200" />
              </div>
              <div className="col-span-2">
                <div className="h-4 w-24 rounded bg-slate-200" />
              </div>
              <div className="col-span-1">
                <div className="h-6 w-16 rounded-full bg-slate-200" />
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-200" />
                <div className="h-8 w-8 rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <EmptyState
          title="No inventory items found"
          description="Try adjusting your category filter or search criteria, or add a new item."
        />
      )}

      {/* Table Rows */}
      {!loading && items.length > 0 && (
        <div className="divide-y divide-slate-100">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const foodName = item.food_name || item.name || "Unnamed Item";
            const isFresh = item.freshness_status === "fresh";

            return (
              <div
                key={item.id}
                className={`grid grid-cols-12 items-center px-6 py-4 text-sm transition hover:bg-slate-50/80 ${
                  isSelected ? "bg-blue-50/40" : ""
                }`}
              >
                {/* Checkbox */}
                <div className="col-span-1 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(item.id)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Product Info */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl shadow-inner">
                    🥗
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 truncate">
                      {foodName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {item.storage_location}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                    {item.category}
                  </span>
                </div>

                {/* Quantity */}
                <div className="col-span-2">
                  <p className="font-semibold text-slate-800">
                    {item.quantity} Units
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.prediction || "Manual entry"}
                  </p>
                </div>

                {/* Expiry */}
                <div className="col-span-2">
                  <p className="font-semibold text-slate-800">
                    {new Date(item.expiry_date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-slate-400">
                    Purchased: {new Date(item.purchase_date).toLocaleDateString()}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      isFresh
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {item.freshness_status || "Fresh"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      title="Edit item"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      title="Delete item"
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InventoryTable;

