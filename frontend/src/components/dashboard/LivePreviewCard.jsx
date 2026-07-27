import { ImageIcon } from "lucide-react";

function LivePreviewCard() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-600">
          Live Preview
        </h3>

        <span className="rounded-full bg-gray-100 px-4 py-2 text-xs text-gray-600">
          No file selected
        </span>
      </div>

      {/* Preview Area */}
      <div className="flex h-60 flex-col items-center justify-center bg-gray-50">

        <ImageIcon
          size={70}
          className="text-gray-300"
        />

        <p className="mt-5 text-gray-400">
          Waiting for selection...
        </p>

      </div>

    </div>
  );
}

export default LivePreviewCard;