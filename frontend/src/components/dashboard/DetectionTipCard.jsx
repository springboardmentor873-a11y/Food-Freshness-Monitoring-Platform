import { ArrowRight } from "lucide-react";

function DetectionTipCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-green-500 p-8 text-white shadow-sm">

      <h2 className="text-4xl font-bold">
        Detection Tip
      </h2>

      <p className="mt-5 text-lg leading-9 text-green-50">
        For the highest accuracy,
        ensure the food is centered in
        the frame and well-lit.
        Avoid shadows and complex
        backgrounds.
      </p>

      <button className="mt-8 flex items-center gap-3 font-semibold">
        View Documentation
        <ArrowRight size={20} />
      </button>

      {/* Decorative Circle */}
      <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full border-[10px] border-green-400 opacity-40" />

    </div>
  );
}

export default DetectionTipCard;