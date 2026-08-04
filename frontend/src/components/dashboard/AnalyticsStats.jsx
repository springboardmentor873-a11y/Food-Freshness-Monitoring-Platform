function AnalyticsStats({ analytics, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-14 w-14 rounded-2xl bg-slate-200" />
              <div className="h-6 w-20 rounded-full bg-slate-200" />
            </div>
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-10 w-24 rounded bg-slate-200" />
            <div className="h-2 w-full rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Foods",
      value: analytics?.total_foods?.toLocaleString() || "0",
      change: "Inventory Items",
      color: "green",
      icon: "🥗",
    },
    {
      title: "Fresh Predictions",
      value: `${analytics?.fresh_percentage || 0}%`,
      change: "Quality Index",
      color: "blue",
      icon: "🫐",
    },
    {
      title: "Spoiled Predictions",
      value: `${analytics?.spoiled_percentage || 0}%`,
      change: "Spoilage Rate",
      color: "red",
      icon: "⚠️",
    },
    {
      title: "Average Confidence",
      value: `${analytics?.average_confidence || 0}%`,
      change: `${analytics?.total_predictions || 0} Runs`,
      color: "gray",
      icon: "🎯",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl shadow-inner">
              {item.icon}
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                item.color === "green"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : item.color === "blue"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : item.color === "red"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {item.change}
            </span>
          </div>

          <p className="uppercase text-xs font-bold tracking-wider text-slate-400">
            {item.title}
          </p>

          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
            {item.value}
          </h2>

          <div
            className={`mt-6 h-2 rounded-full ${
              item.color === "green"
                ? "bg-green-500"
                : item.color === "blue"
                ? "bg-blue-500"
                : item.color === "red"
                ? "bg-red-500"
                : "bg-slate-400"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default AnalyticsStats;

