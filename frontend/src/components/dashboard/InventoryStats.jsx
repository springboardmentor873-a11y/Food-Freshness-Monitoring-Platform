import { ClipboardList, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";

function getThreeDaysAhead() {
  return new Date(Date.now() + 3 * 86400000);
}

function InventoryStats({ items = [], total = 0 }) {
  const expiryThreshold = getThreeDaysAhead();
  const freshCount = items.filter((item) => item.freshness_status === "fresh").length;
  const expiringCount = items.filter(
    (item) => new Date(item.expiry_date) <= expiryThreshold
  ).length;

  const totalCount = total || items.length;
  const freshnessIndex = items.length
    ? ((freshCount / items.length) * 100).toFixed(1)
    : "100.0";

  const averageConfidence = items.length
    ? (
        (items.reduce((sum, item) => sum + (item.confidence || 0.95), 0) /
          items.length) *
        100
      ).toFixed(1)
    : "95.0";

  const stats = [
    {
      title: "TOTAL ITEMS",
      value: totalCount.toLocaleString(),
      change: "+12% vs LW",
      color: "text-green-600",
      bg: "bg-green-50 border-green-100",
      icon: ClipboardList,
    },
    {
      title: "NEAR EXPIRY",
      value: expiringCount.toString(),
      change: expiringCount > 0 ? "Action Needed" : "Optimal",
      color: expiringCount > 0 ? "text-red-600" : "text-slate-600",
      bg: expiringCount > 0 ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100",
      icon: AlertTriangle,
    },
    {
      title: "FRESHNESS INDEX",
      value: `${freshnessIndex}%`,
      change: "Optimal",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
      icon: ShieldCheck,
    },
    {
      title: "CONFIDENCE SCORE",
      value: `${averageConfidence}%`,
      change: "24h Avg",
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-100",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition hover:shadow-md"
          >
            <div className="mb-6 flex items-start justify-between">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${item.bg}`}
              >
                <Icon size={24} className={item.color} />
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  item.change === "Action Needed"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {item.change}
              </span>
            </div>

            <p className="text-xs font-bold tracking-wider uppercase text-slate-400">
              {item.title}
            </p>

            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
              {item.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}

export default InventoryStats;
