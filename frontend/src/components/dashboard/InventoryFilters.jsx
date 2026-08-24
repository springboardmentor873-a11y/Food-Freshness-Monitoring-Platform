import { Plus, Upload, Search } from "lucide-react";

function InventoryFilters({
  category,
  onCategoryChange,
  onSearchChange,
  search,
  total,
  onAddItem,
  onImportClick,
}) {
  const categories = ["", "Bread", "Dairy", "Fruits", "Vegetables"];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((value) => {
            const isActive =
              (category || "").toLowerCase() === value.toLowerCase();
            return (
              <button
                key={value || "all"}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                onClick={() => onCategoryChange(value)}
                type="button"
              >
                {value || "All Categories"}
              </button>
            );
          })}

          <span className="ml-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            {total} Items
          </span>
        </div>

        {/* Right Search & Add Inventory Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 shadow-xs focus:border-blue-500 focus:outline-none"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search food, location..."
              value={search}
            />
          </div>

          {onAddItem && (
            <button
              onClick={onAddItem}
              type="button"
              className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md cursor-pointer shrink-0"
            >
              <Plus size={16} />
              Add Inventory Item
            </button>
          )}

          {onImportClick && (
            <button
              onClick={onImportClick}
              type="button"
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 cursor-pointer shrink-0"
            >
              <Upload size={16} />
              Import CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryFilters;
