import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";

function BulkImportModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please select a valid .csv file.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await onImport(file);
      setResult(res);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to bulk import inventory CSV."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl transition-all">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UploadCloud size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Bulk Import Inventory
              </h2>
              <p className="text-sm text-slate-500">
                Upload a CSV spreadsheet to import items in bulk.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* CSV Template Guidance */}
        <div className="mb-6 rounded-2xl bg-slate-50 p-4 border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            CSV File Column Requirements
          </p>
          <code className="block rounded-lg bg-slate-100 p-3 text-xs text-slate-800 font-mono border border-slate-200 overflow-x-auto">

            food_name,category,quantity,purchase_date,expiry_date,storage_location
          </code>
          <p className="mt-2 text-xs text-slate-500">
            Dates must use ISO format (<span className="font-mono">YYYY-MM-DD</span>).
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm text-green-800 border border-green-200">
            <div className="flex items-center gap-2 font-bold text-green-900 mb-1">
              <CheckCircle2 size={18} className="text-green-600" />
              <span>Import Completed Successfully</span>
            </div>
            <p>
              Imported <strong>{result.imported_count}</strong> items. Failed:{" "}
              <strong>{result.failed_count}</strong>.
            </p>
            {result.errors && result.errors.length > 0 && (
              <ul className="mt-2 max-h-32 overflow-y-auto text-xs text-red-600 list-disc pl-4 space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center hover:border-blue-400 hover:bg-blue-50/20 transition">
            <FileText size={40} className="mb-3 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">
              {file ? file.name : "Click or drag CSV file to upload"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports UTF-8 formatted .csv files"}
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              {result ? "Close" : "Cancel"}
            </button>
            {!result && (
              <button
                type="submit"
                disabled={loading || !file}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Importing..." : "Upload & Import"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default BulkImportModal;
