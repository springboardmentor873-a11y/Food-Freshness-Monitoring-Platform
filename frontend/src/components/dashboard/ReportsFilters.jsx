import { Filter } from "lucide-react";

function ReportsFilters({ reportType = "all", onTypeChange, status = "all", onStatusChange }) {
  const types = [
    { id: "all", label: "All Reports" },
    { id: "prediction", label: "Prediction" },
    { id: "inventory", label: "Inventory" },
    { id: "shelf_life", label: "Shelf Life" },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Report Type
          </p>

          <div className="flex flex-wrap rounded-2xl bg-slate-100 p-1 w-fit border border-slate-200/60">
            {types.map((t) => {
              const active = reportType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTypeChange && onTypeChange(t.id)}
                  className={`rounded-xl px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Filter size={14} className="text-slate-400" />
            <span>Status:</span>
          </div>

          <select
            value={status}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="ready">Ready for Export</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ReportsFilters;