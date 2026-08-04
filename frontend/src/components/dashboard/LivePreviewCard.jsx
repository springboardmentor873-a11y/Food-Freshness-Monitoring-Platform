import { useState } from "react";
import { ImageIcon, LoaderCircle, Database, FileDown, RefreshCw, CheckCircle2 } from "lucide-react";
import { createInventory } from "../../services/inventory";
import { downloadPredictionReport } from "../../services/reports";

function LivePreviewCard({
  error,
  isPredicting,
  prediction,
  previewUrl,
  selectedFile,
  onReset,
}) {
  const isFresh = prediction?.freshness_status === "fresh";
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleSaveToInventory = async () => {
    if (!prediction || saving) return;
    setSaving(true);
    setActionError("");
    try {
      const foodName = (prediction.predicted_class || prediction.prediction || "Scanned Item")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      await createInventory({
        food_name: foodName,
        category: "Fruits",
        quantity: 1,
        purchase_date: new Date().toISOString().split("T")[0],
        expiry_date: new Date(Date.now() + (prediction.shelf_life_days || 5) * 86400000)
          .toISOString()
          .split("T")[0],
        storage_location: "Main Refrigerator Shelf 1",
        prediction: prediction.predicted_class || prediction.prediction,
        confidence: prediction.confidence,
        freshness_status: prediction.freshness_status,
      });
      setSavedSuccess(true);
    } catch (err) {
      setActionError(err.response?.data?.detail || "Failed to save to inventory.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    setActionError("");
    try {
      await downloadPredictionReport("pdf");
    } catch (err) {
      setActionError(err.response?.data?.detail || "Failed to download report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
      <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50/50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Live AI Preview
        </h3>

        <span className="max-w-40 truncate rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {selectedFile ? selectedFile.name : "No file selected"}
        </span>
      </div>

      <div className="flex h-56 flex-col items-center justify-center bg-slate-100 border-b border-slate-200 overflow-hidden relative">

        {previewUrl ? (
          <img
            alt="Selected food preview"
            className="h-full w-full object-cover"
            src={previewUrl}
          />
        ) : (
          <>
            <ImageIcon size={48} className="text-slate-600 mb-2" />
            <p className="text-xs font-semibold text-slate-400">Waiting for image selection...</p>
          </>
        )}
      </div>

      {isPredicting && (
        <div className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-blue-600 bg-blue-50/50 border-b border-blue-100">
          <LoaderCircle className="animate-spin" size={18} />
          Running EfficientNetB0 Neural Inference...
        </div>
      )}

      {prediction && (
        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isFresh
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {prediction.freshness_status}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Confidence: <strong>{(prediction.confidence * 100).toFixed(1)}%</strong>
            </span>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Classified Label
            </p>
            <p className="mt-0.5 text-xl font-extrabold capitalize text-slate-900">
              {(prediction.predicted_class || prediction.prediction).replaceAll("_", " ")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Shelf Life</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {prediction.shelf_life_days === 0 ? "0 Days (Expired)" : `${prediction.shelf_life_days || 5} Days`}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recommendation</p>
              <p className="mt-1 text-xs font-medium text-slate-700 truncate">
                {prediction.storage_recommendation || "Refrigerate at 4°C"}
              </p>
            </div>
          </div>

          {/* Persistent Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            {actionError && (
              <p className="text-xs font-semibold text-red-600 mb-2">{actionError}</p>
            )}

            <button
              onClick={handleSaveToInventory}
              disabled={saving || savedSuccess}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition ${
                savedSuccess
                  ? "bg-green-600 cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={14} />
                  Saved to Database Inventory
                </>
              ) : (
                <>
                  <Database size={14} />
                  {saving ? "Saving..." : "Save to Database"}
                </>
              )}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                <FileDown size={14} />
                {downloading ? "Downloading..." : "Export PDF"}
              </button>

              {onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  <RefreshCw size={14} />
                  Rescan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className="px-6 pb-5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

export default LivePreviewCard;
