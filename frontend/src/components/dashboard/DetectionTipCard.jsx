import { ArrowRight } from "lucide-react";

function DetectionTipCard() {
  const handleScrollToDoc = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-green-600 p-8 text-white shadow-sm">
      <h2 className="text-2xl font-extrabold">
        AI Detection Tip
      </h2>

      <p className="mt-3 text-xs leading-relaxed text-green-50">
        For optimal neural accuracy, ensure sample produce is centered in frame under even lighting. Avoid intense shadows and busy background textures.
      </p>

      <button
        onClick={handleScrollToDoc}
        type="button"
        className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-2xl transition cursor-pointer"
      >
        <span>View Documentation</span>
        <ArrowRight size={16} />
      </button>

      {/* Decorative Circle */}
      <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full border-[10px] border-green-400 opacity-30" />
    </div>
  );
}

export default DetectionTipCard;