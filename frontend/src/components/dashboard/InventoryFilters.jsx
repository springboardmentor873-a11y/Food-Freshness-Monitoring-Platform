function InventoryFilters() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div className="flex flex-wrap items-center gap-3">

          <button className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white">
            All Food
          </button>

          <button className="rounded-xl px-5 py-2 text-gray-600 hover:bg-gray-100">
            Produce
          </button>

          <button className="rounded-xl px-5 py-2 text-gray-600 hover:bg-gray-100">
            Dairy
          </button>

          <button className="rounded-xl px-5 py-2 text-gray-600 hover:bg-gray-100">
            Meat
          </button>

          <span className="ml-3 text-sm text-gray-500">
            1,284 Results
          </span>

        </div>

        {/* Right */}

        <button className="flex items-center gap-2 rounded-xl border px-5 py-2 font-medium text-gray-700 hover:bg-gray-50">
          Sort by: Expiry Date
          ▼
        </button>

      </div>

    </div>
  );
}

export default InventoryFilters;