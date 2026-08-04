function InventoryFilters({ category, onCategoryChange, onSearchChange, search, total }) {
  const categories = ["", "Bread", "Dairy", "Fruits", "Vegetables"];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((value) => {
            const isActive =
              (category || "").toLowerCase() === value.toLowerCase();
            return (
              <button
                key={value || "all"}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => onCategoryChange(value)}
                type="button"
              >
                {value || "All Categories"}
              </button>
            );
          })}

          <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {total} Items
          </span>
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-72">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search food by name, location..."
            value={search}
          />
        </div>
      </div>
    </div>
  );
}

export default InventoryFilters;

