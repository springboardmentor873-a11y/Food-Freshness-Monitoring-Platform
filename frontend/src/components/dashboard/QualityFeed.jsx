import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function QualityFeed({ activity = [] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-white shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Live AI Quality Inspection Feed
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time model inferences and confidence score logs</p>
        </div>

        <button
          onClick={() => navigate("/prediction-history")}
          type="button"
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
        >
          <span>View All Logs</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-8 py-4">Food Classification</th>
              <th className="px-6 py-4">Neural Confidence</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {activity.map((feed) => (
              <tr key={`${feed.prediction}-${feed.created_at}`} className="hover:bg-slate-50/60 transition">
                <td className="px-8 py-5 font-extrabold capitalize text-slate-900">
                  {feed.prediction.replaceAll("_", " ")}
                </td>
                <td className="px-6 py-5 font-semibold text-slate-700">
                  {(feed.confidence * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      feed.freshness_status === "fresh"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {feed.freshness_status}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs text-slate-500 font-medium">
                  {new Date(feed.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {!activity.length && (
              <tr>
                <td className="px-8 py-6 text-center text-xs font-semibold text-slate-400" colSpan={4}>
                  No prediction activity recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QualityFeed;
