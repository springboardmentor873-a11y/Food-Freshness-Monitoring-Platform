import { ImageIcon, LoaderCircle } from "lucide-react";

function LivePreviewCard({
  error,
  isPredicting,
  prediction,
  previewUrl,
  selectedFile,
}) {
  const isFresh = prediction?.freshness_status === "fresh";

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">
          Live Preview
        </h3>

        <span className="max-w-36 truncate rounded-full bg-gray-100 px-4 py-2 text-xs text-gray-600">
          {selectedFile ? selectedFile.name : "No file selected"}
        </span>
      </div>

      <div className="flex h-60 flex-col items-center justify-center bg-gray-50">
        {previewUrl ? (
          <img
            alt="Selected food preview"
            className="h-full w-full object-cover"
            src={previewUrl}
          />
        ) : (
          <>
            <ImageIcon size={70} className="text-gray-300" />
            <p className="mt-5 text-gray-400">Waiting for selection...</p>
          </>
        )}
      </div>

      {isPredicting && (
        <div className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-blue-600">
          <LoaderCircle className="animate-spin" size={18} />
          Analyzing image...
        </div>
      )}

      {prediction && (
        <div className="space-y-3 px-6 py-5">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${
              isFresh ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {prediction.freshness_status}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Predicted Class
            </p>
            <p className="mt-1 text-lg font-bold capitalize text-gray-900">
              {prediction.predicted_class.replaceAll("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Confidence
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {(prediction.confidence * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {error && <p className="px-6 pb-5 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

export default LivePreviewCard;
