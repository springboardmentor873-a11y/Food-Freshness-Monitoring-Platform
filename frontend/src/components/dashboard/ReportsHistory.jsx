import { FileText, CheckCircle2, Clock } from "lucide-react";

function ReportsHistory({ history = [], loading = false }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Archival History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            System generated quality audits & prediction logs
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100">
          {history.length} Saved Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="px-8 py-4">Report Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4">Generated Date</th>
              <th className="px-6 py-4 text-center">Format</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {loading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Loading prediction report archives...
                </td>
              </tr>
            )}

            {!loading && history.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No prediction history available in archive.
                </td>
              </tr>
            )}

            {!loading &&
              history.map((item) => {
                const label = (item.prediction || "Report")
                  .replaceAll("_", " ")
                  .toUpperCase();
                const isFresh =
                  item.freshness_status?.toLowerCase() === "fresh";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 capitalize">
                            {label.toLowerCase()} Analysis Report
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: #{String(item.id).slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          isFresh
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <CheckCircle2 size={12} />
                        {item.freshness_status || "Processed"}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-700">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>

                    <td className="px-6 py-5 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span>
                          {new Date(item.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-700">
                        PDF
                      </span>
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

export default ReportsHistory;
