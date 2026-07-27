import { CloudUpload } from "lucide-react";

function FoodUploadCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      {/* Card Title */}
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">
        Food Upload
      </h2>

      {/* Upload Area */}
      <div className="flex h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-400 transition hover:bg-green-50">

        {/* Upload Icon */}
        <div className="mb-6 rounded-full bg-green-100 p-6">
          <CloudUpload
            size={50}
            className="text-green-600"
          />
        </div>

        {/* Main Text */}
        <h3 className="text-2xl font-semibold text-gray-800">
          Drag and drop your food image
        </h3>

        {/* Browse Text */}
        <p className="mt-3 text-gray-500">
          or{" "}
          <span className="cursor-pointer font-medium text-green-600 hover:underline">
            browse files
          </span>{" "}
          from your computer
        </p>

        {/* Supported Formats */}
        <div className="mt-8 flex gap-3">

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            JPG
          </span>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            PNG
          </span>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
            HEIC
          </span>

        </div>

      </div>

    </div>
  );
}

export default FoodUploadCard;