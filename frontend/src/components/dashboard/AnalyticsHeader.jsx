function AnalyticsHeader() {
  return (
    <div className="flex items-start justify-between">

      <div>
        <h1 className="text-5xl font-bold text-slate-900">
          Analytics Overview
        </h1>

        <p className="mt-3 text-xl text-gray-500">
          Detailed performance tracking for global food logistics.
        </p>
      </div>

      <div className="flex gap-4">

        <button className="rounded-xl border bg-white px-6 py-3 font-medium shadow-sm hover:bg-gray-50">
          📅 Last 30 Days
        </button>

        <button className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
          ⬇ Export Report
        </button>

      </div>

    </div>
  );
}

export default AnalyticsHeader;