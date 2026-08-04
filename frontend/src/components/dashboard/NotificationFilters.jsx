function NotificationFilters({ onMarkAllRead, onTypeChange, type }) {
  const filterOptions = [
    { label: "All Activity", value: "" },
    { label: "Urgent Alerts", value: "spoiled_food_alert" },
    { label: "Expiring Items", value: "expiry_reminder" },
    { label: "System Health", value: "prediction_completed" },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value || "all"}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                type === opt.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              onClick={() => onTypeChange(opt.value)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={onMarkAllRead}
          type="button"
        >
          Mark All as Read
        </button>
      </div>
    </div>
  );
}

export default NotificationFilters;

