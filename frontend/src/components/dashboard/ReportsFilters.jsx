function ReportsFilters() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="grid grid-cols-2 gap-10">

        <div>

          <p className="mb-4 text-sm font-semibold uppercase text-gray-500">
            Report Type
          </p>

          <div className="flex rounded-xl bg-slate-100 p-1 w-fit">

            <button className="rounded-lg bg-white px-6 py-2 font-medium text-blue-600 shadow">
              All Reports
            </button>

            <button className="px-6 py-2">
              Prediction
            </button>

            <button className="px-6 py-2">
              Inventory
            </button>

            <button className="px-6 py-2">
              Shelf Life
            </button>

          </div>

        </div>

        <div>

          <p className="mb-4 text-sm font-semibold uppercase text-gray-500">
            Status
          </p>

          <select className="rounded-xl border px-5 py-3">

            <option>Ready for Export</option>

            <option>Generating</option>

            <option>Archived</option>

          </select>

        </div>

      </div>

    </div>
  );
}

export default ReportsFilters;