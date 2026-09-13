import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import ProductThumbnail from "../ui/ProductThumbnail";

function RecentPredictionsTable({ predictions = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
      <div className="border-b border-slate-100 px-8 py-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Recent AI Predictions
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-100">
              <Sparkles size={12} />
              EfficientNetB0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time inference logs and freshness confidence metrics.
          </p>
        </div>

        <button
          onClick={() => navigate("/prediction-history")}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
        >
          <span>View All Logs</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="px-8 py-4">Food / Model Result</th>
              <th className="px-6 py-4">AI Confidence</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Timestamp</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {loading && (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-4">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 rounded bg-slate-200" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 rounded-full bg-slate-200" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-4 w-20 rounded bg-slate-200 ml-auto" />
                    </td>
                  </tr>
                ))}
              </>
            )}

            {!loading && predictions.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No prediction runs recorded yet.
                </td>
              </tr>
            )}

            {!loading &&
              predictions.slice(0, 5).map((item, index) => {
                const isFresh =
                  item.freshness_status?.toLowerCase() === "fresh";
                const confidencePct = item.confidence
                  ? Math.round(
                      item.confidence > 1
                        ? item.confidence
                        : item.confidence * 100
                    )
                  : 0;

                return (
                  <tr
                    key={item.id || index}
                    className="hover:bg-slate-50/60 transition"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <ProductThumbnail name={item.prediction || "food"} size="sm" />
                        <div>
                          <p className="font-bold text-slate-900 capitalize">
                            {item.prediction || "Analyzed Item"}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: #{item.id ? String(item.id).slice(0, 8) : index + 101}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-700 w-10">
                          {confidencePct}%
                        </span>
                        <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFresh ? "bg-green-500" : "bg-red-500"
                            }`}
                            style={{ width: `${confidencePct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          isFresh
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {isFresh ? (
                          <CheckCircle2 size={12} className="text-green-600" />
                        ) : (
                          <AlertCircle size={12} className="text-red-500" />
                        )}
                        {item.freshness_status || "Unknown"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-xs font-medium text-slate-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentPredictionsTable;
