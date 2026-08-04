import { CheckCircle2, AlertTriangle, Settings } from "lucide-react";

function AnalysisResultCard({ prediction, previewUrl, batchId }) {
  const isFresh = prediction?.freshness_status?.toLowerCase() === "fresh";
  const label = prediction?.prediction
    ? prediction.prediction.replace("_", " ").toUpperCase()
    : "FOOD ITEM";
  const displayBatch = batchId || "BATCH #AV-2024-009";


  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
      {/* Image Section */}
      <div className="relative bg-slate-100 border-b border-slate-200">

        {/* Status Badge */}
        <div
          className={`absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md ${
            isFresh ? "bg-green-500/90" : "bg-red-500/90"
          }`}
        >
          {isFresh ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{isFresh ? "✓ FRESH" : "⚠️ SPOILED"}</span>
        </div>

        {/* Uploaded or Selected Image */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={label}
            className="h-[380px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[380px] w-full items-center justify-center bg-slate-800 text-slate-500">
            <span className="text-sm font-semibold">No Image Preview</span>
          </div>
        )}
      </div>

      {/* Details Bar */}
      <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 capitalize">
            {label.toLowerCase()}
          </h2>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            {displayBatch}
          </p>
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}

export default AnalysisResultCard;