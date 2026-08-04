function FreshnessScoreCard({ prediction }) {
  const isFresh = prediction?.freshness_status?.toLowerCase() === "fresh";
  const confidencePct = prediction?.confidence
    ? Math.round(
        prediction.confidence > 1
          ? prediction.confidence
          : prediction.confidence * 100
      )
    : 95;

  const estShelfLife = isFresh ? "5 - 7 Days" : "0 Days (Spoiled)";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
      <div className="mb-6 flex items-center justify-between">
        <span
          className={`rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider ${
            isFresh
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isFresh ? "Optimal Quality" : "Spoilage Degradation Detected"}
        </span>

        <span className="text-xs font-semibold text-slate-400">
          Est. Shelf Life: <strong className="text-slate-800">{estShelfLife}</strong>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Freshness Circle Gauge */}
        <div
          className={`flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-[10px] shadow-inner ${
            isFresh ? "border-green-500" : "border-red-500"
          }`}
        >
          <div className="text-center">
            <h1
              className={`text-5xl font-extrabold ${
                isFresh ? "text-green-600" : "text-red-600"
              }`}
            >
              {confidencePct}%
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              FRESHNESS
            </p>
          </div>
        </div>

        {/* Details Pane */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
            {isFresh
              ? "Peak Consumption Window"
              : "Action Required: High Spoilage Risk"}
          </h2>

          <p className="text-sm leading-relaxed text-slate-500">
            {isFresh
              ? "Neural network spectral analysis confirms prime consumption quality with minimal cellular degradation."
              : "Thermal and color shift analysis detected microbial spoilage. Isolate item from inventory immediately."}
          </p>

          <p
            className={`mt-3 text-sm font-bold ${
              isFresh ? "text-green-600" : "text-red-600"
            }`}
          >
            {isFresh
              ? "✓ Suggested immediate rotation to premium display shelf."
              : "⚠️ Recommended immediate disposal or segregation."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FreshnessScoreCard;