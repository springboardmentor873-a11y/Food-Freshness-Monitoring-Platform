import { Camera, LoaderCircle, Sparkles, Upload } from "lucide-react";

function ActionButtons({
  hasSelectedFile,
  isPredicting,
  onCapture,
  onPredict,
  onUpload,
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <button
        className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPredicting}
        onClick={onUpload}
        type="button"
      >
        <Upload size={20} />
        Upload Image
      </button>

      <button
        className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-4 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPredicting}
        onClick={onCapture}
        type="button"
      >
        <Camera size={20} />
        Capture Image
      </button>

      <button
        className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!hasSelectedFile || isPredicting}
        onClick={onPredict}
        type="button"
      >
        {isPredicting ? <LoaderCircle className="animate-spin" size={20} /> : <Sparkles size={20} />}
        {isPredicting ? "Analyzing..." : "Analyze Food"}
      </button>
    </div>
  );
}

export default ActionButtons;
