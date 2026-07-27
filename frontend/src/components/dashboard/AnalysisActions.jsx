function AnalysisActions() {
  return (
    <div className="flex justify-end gap-4">

      <button className="rounded-xl border border-blue-500 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50">
        🔄 Rescan Batch
      </button>

      <button className="rounded-xl border border-blue-500 px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50">
        💾 Save to Database
      </button>

      <button className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600">
        ⬇ Download Report
      </button>

    </div>
  );
}

export default AnalysisActions;