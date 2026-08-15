import { useState } from "react";
import { ImageIcon, LoaderCircle, Database, FileDown, RefreshCw, CheckCircle2, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";
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
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200/80 transition-all duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b px-8 py-5 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              AI Analysis & Live Quality Inspection
            </h3>
            <p className="text-[11px] font-semibold text-slate-400">
              EfficientNetB0 Deep Learning Classification Engine
            </p>
          </div>
        </div>

        <span className="max-w-xs truncate rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 border border-slate-200">
          {selectedFile ? selectedFile.name : "No file selected"}
        </span>
      </div>

      {/* Main Analysis Body */}
      <div className="p-8">
        {!previewUrl && !isPredicting && !prediction && (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl bg-slate-50/50 border border-dashed border-slate-200">
            <ImageIcon size={52} className="text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No Image Selected for Analysis</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Upload or capture a food sample image above and click "Analyze Food" to run deep learning classification.
            </p>
          </div>
        )}

        {isPredicting && (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl bg-blue-50/40 border border-blue-100">
            <LoaderCircle className="animate-spin text-blue-600 mb-3" size={36} />
            <p className="text-sm font-extrabold text-slate-900">Running EfficientNetB0 Neural Inference...</p>
            <p className="text-xs text-slate-500 mt-1">Analyzing texture, color spectrum, and degradation markers...</p>
          </div>
        )}

        {(previewUrl || prediction) && !isPredicting && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Image Container (Left Column - 5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner group">
                <img
                  alt="Selected food preview"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={previewUrl}
                />

                {prediction && (
                  <div
                    className={`absolute top-4 left-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-md ${
                      isFresh ? "bg-green-600/90" : "bg-red-600/90"
                    }`}
                  >
                    {isFresh ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span>{isFresh ? "FRESH" : "SPOILED"}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
                <span>Sample Format: Standard RGB</span>
                <span>Resolution: 224×224 AI Native</span>
              </div>
            </div>

            {/* Analysis Metrics & Action Column (Right Column - 7 cols) */}
            <div className="md:col-span-7 space-y-6">
              {prediction ? (
                <>
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Classified Food Label
                      </p>
                      <h4 className="text-3xl font-black capitalize text-slate-900 mt-0.5">
                        {(prediction.predicted_class || prediction.prediction).replaceAll("_", " ")}
                      </h4>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        AI Confidence
                      </p>
                      <p className="text-2xl font-extrabold text-blue-600 mt-0.5">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Confidence Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                      <span>Neural Confidence Match</span>
                      <span>{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                      <div
                        className={`h-full transition-all duration-500 ${isFresh ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${(prediction.confidence * 100).toFixed(1)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric Sub-Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Shelf Life</p>
                      <p className="mt-1 text-base font-extrabold text-slate-900">
                        {prediction.shelf_life_days === 0 ? "0 Days (Expired / Spoiled)" : `${prediction.shelf_life_days || 5} Days Remaining`}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Optimal Temperature</p>
                      <p className="mt-1 text-base font-extrabold text-slate-900">
                        4°C (Refrigerated)
                      </p>
                    </div>

                    <div className="sm:col-span-2 rounded-2xl bg-slate-50 p-4 border border-slate-200/70">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Actionable Storage Recommendation</p>
                      <p className="mt-1 text-xs font-bold text-slate-800 leading-relaxed">
                        {prediction.storage_recommendation || "Store in low-humidity refrigerator shelf at 4°C."}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    {actionError && (
                      <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{actionError}</p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleSaveToInventory}
                        disabled={saving || savedSuccess}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 px-6 text-xs font-bold text-white shadow-sm transition ${
                          savedSuccess
                            ? "bg-green-600 cursor-default"
                            : "bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        }`}
                      >
                        {savedSuccess ? (
                          <>
                            <CheckCircle2 size={16} />
                            Saved to Database Inventory
                          </>
                        ) : (
                          <>
                            <Database size={16} />
                            {saving ? "Saving to Database..." : "Save to Database Inventory"}
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleDownloadReport}
                        disabled={downloading}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
                      >
                        <FileDown size={16} />
                        {downloading ? "Exporting..." : "Export PDF Report"}
                      </button>

                      {onReset && (
                        <button
                          onClick={onReset}
                          className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-xs"
                        >
                          <RefreshCw size={15} />
                          Rescan
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-center h-full space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 border border-blue-100 w-fit">
                    <ShieldCheck size={14} />
                    <span>Image Ready for AI Analysis</span>
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900">
                    Click "Analyze Food" to run AI inspection
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Once you click **Analyze Food**, our deep learning EfficientNetB0 neural model will evaluate surface decay, color spectrum, and estimated shelf life.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="px-8 pb-6 text-xs font-bold text-red-600 bg-red-50 p-4 mx-8 mb-6 rounded-2xl border border-red-200">{error}</p>}
    </div>
  );
}

export default LivePreviewCard;
