import {
  ClipboardList,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "TOTAL ITEMS",
    value: "8,432",
    change: "+12% vs LW",
    color: "text-green-500",
    bg: "bg-green-100",
    icon: ClipboardList,
  },
  {
    title: "NEAR EXPIRY",
    value: "24",
    change: "Critical",
    color: "text-red-500",
    bg: "bg-red-100",
    icon: AlertTriangle,
  },
  {
    title: "FRESHNESS INDEX",
    value: "94.2%",
    change: "Optimal",
    color: "text-blue-500",
    bg: "bg-blue-100",
    icon: ShieldCheck,
  },
  {
    title: "TURNOVER RATE",
    value: "0.85",
    change: "24h",
    color: "text-gray-700",
    bg: "bg-gray-100",
    icon: TrendingUp,
  },
];

function InventoryStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-start justify-between">

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}
              >
                <Icon
                  size={28}
                  className={item.color}
                />
              </div>

              <span className={`text-sm font-semibold ${item.color}`}>
                {item.change}
              </span>

            </div>

            <p className="text-sm font-bold tracking-wide text-gray-500">
              {item.title}
            </p>

            <h2 className="mt-3 text-5xl font-bold text-gray-900">
              {item.value}
            </h2>

          </div>
        );
      })}
    </div>
  );
}

export default InventoryStats;