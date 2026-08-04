import { TrendingUp, TrendingDown } from "lucide-react";

function StatCard({
  title,
  value,
  icon,
  color = "blue",
  trend,
  isPositive = true,
  description,
  progress,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-14 w-14 rounded-2xl bg-slate-200" />
          <div className="h-5 w-16 rounded-full bg-slate-200" />
        </div>
        <div className="h-3 w-28 rounded bg-slate-200" />
        <div className="h-8 w-24 rounded bg-slate-200" />
        <div className="h-2 w-full rounded-full bg-slate-200" />
      </div>
    );
  }

  const badgeStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  const progressStyles = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-transform group-hover:scale-105 ${
            badgeStyles[color] || badgeStyles.blue
          }`}
        >
          {icon}
        </div>

        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
              isPositive
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <h2 className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900">
          {value}
        </h2>

        {description && (
          <p className="mt-1 text-xs font-medium text-slate-500">
            {description}
          </p>
        )}
      </div>

      {progress != null && (
        <div className="mt-4">
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressStyles[color] || progressStyles.blue
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StatCard;