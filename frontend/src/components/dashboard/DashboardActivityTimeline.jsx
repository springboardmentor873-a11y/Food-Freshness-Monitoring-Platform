import { Activity, CheckCircle2, AlertTriangle } from "lucide-react";


function DashboardActivityTimeline({ activity = [], loading = false }) {
  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 animate-pulse space-y-4">
        <div className="h-6 w-32 rounded bg-slate-200" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Operations Feed</h3>
            <p className="text-xs text-slate-400">Live platform events</p>
          </div>
        </div>
        <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-100">
          Live
        </span>
      </div>

      {activity.length === 0 ? (
        <p className="p-4 text-center text-xs text-slate-400">
          No recent platform activity logged.
        </p>
      ) : (
        <div className="relative space-y-6 pl-4 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {activity.slice(0, 5).map((item, index) => {
            const isFresh = item.freshness_status === "fresh";
            const dateStr = item.created_at
              ? new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now";

            return (
              <div key={index} className="relative flex items-start gap-4 group">
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-transform group-hover:scale-110 ${
                    isFresh ? "bg-green-500" : "bg-amber-500"
                  }`}
                >
                  {isFresh ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <AlertTriangle size={14} />
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-800 capitalize truncate">
                      {item.prediction || "System Activity"}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      {dateStr}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-slate-500 truncate">
                    Confidence:{" "}
                    <strong>
                      {item.confidence
                        ? `${Math.round(item.confidence * 100)}%`
                        : "N/A"}
                    </strong>{" "}
                    • Status:{" "}
                    <span
                      className={`font-semibold ${
                        isFresh ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {item.freshness_status || "Processed"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DashboardActivityTimeline;
