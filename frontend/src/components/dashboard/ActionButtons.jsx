import { Upload, Camera, Sparkles } from "lucide-react";

function ActionButtons() {
  return (
    <div className="grid grid-cols-3 gap-4">

      {/* Upload */}
      <button className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700">

        <Upload size={20} />

        Upload Image

      </button>

      {/* Camera */}
      <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-4 font-semibold text-gray-700 transition hover:bg-gray-100">

        <Camera size={20} />

        Capture Image

      </button>

      {/* Analyze */}
      <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-4 font-semibold text-white transition hover:bg-blue-600">

        <Sparkles size={20} />

        Analyze Food

      </button>

    </div>
  );
}

export default ActionButtons;