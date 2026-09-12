import { useCallback, useRef, useState } from "react";
import { UploadCloud, ImageIcon, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { appToast } from "../ui/Toast";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;

/**
 * DragDropUpload — native drag-and-drop + click-to-browse image picker.
 * Validates type/size, shows a live preview, and hands the file back to
 * the parent via onFileSelect.
 */
export default function DragDropUpload({ onFileSelect, previewUrl, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const validateAndEmit = useCallback(
    (file) => {
      if (!file) return;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        appToast.error("Please upload a JPEG, PNG, or WEBP image.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        appToast.error(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndEmit(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    validateAndEmit(file);
    e.target.value = "";
  };

  if (previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <img src={previewUrl} alt="Selected food item preview" className="h-72 w-full object-cover sm:h-96" />
        <button
          onClick={onClear}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/60 text-white backdrop-blur-sm transition-colors hover:bg-slate-950/80"
          aria-label="Remove image"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={cn(
        "flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition-colors sm:h-96",
        isDragging
          ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-500/10"
          : "border-slate-200 bg-slate-50/60 hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-emerald-700"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
        {isDragging ? <ImageIcon size={24} /> : <UploadCloud size={24} />}
      </span>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {isDragging ? "Drop your image here" : "Drag & drop a food photo"}
      </p>
      <p className="mt-1 text-xs text-slate-400">or click to browse — JPEG, PNG, WEBP up to {MAX_SIZE_MB}MB</p>
    </div>
  );
}
