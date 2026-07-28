import { CloudUpload, FileImage } from "lucide-react";

function FoodUploadCard({
  cameraInputRef,
  error,
  fileInputRef,
  isPredicting,
  onFileSelect,
  selectedFile,
}) {
  const handleInputChange = (event) => {
    onFileSelect(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (!isPredicting) {
      onFileSelect(event.dataTransfer.files?.[0]);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">
        Food Upload
      </h2>

      <input
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={isPredicting}
        onChange={handleInputChange}
        type="file"
      />
      <input
        ref={cameraInputRef}
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        disabled={isPredicting}
        onChange={handleInputChange}
        type="file"
      />

      <div
        className="flex h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-400 transition hover:bg-green-50"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="mb-6 rounded-full bg-green-100 p-6">
          <CloudUpload
            size={50}
            className="text-green-600"
          />
        </div>

        <h3 className="text-2xl font-semibold text-gray-800">
          {selectedFile ? "Image ready for analysis" : "Drag and drop your food image"}
        </h3>

        {selectedFile ? (
          <div className="mt-3 flex items-center gap-2 text-gray-600">
            <FileImage size={18} className="text-green-600" />
            <span className="max-w-72 truncate font-medium">{selectedFile.name}</span>
          </div>
        ) : (
          <p className="mt-3 text-gray-500">
            or{" "}
            <button
              className="font-medium text-green-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPredicting}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              browse files
            </button>{" "}
            from your computer
          </p>
        )}

        <div className="mt-8 flex gap-3">
          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            JPG
          </span>
          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            PNG
          </span>
          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            WEBP
          </span>
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

    </div>
  );
}

export default FoodUploadCard;
