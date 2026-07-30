import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

/**
 * ConfidenceMeter — shows how confident the model is in its own prediction.
 * Deliberately a horizontal bar (not another ring) so it reads as a distinct
 * signal from the Freshness Gauge, even though both are 0-100 values.
 */
export default function ConfidenceMeter({ confidence = 0 }) {
  const clamped = Math.max(0, Math.min(100, confidence));
  const tone =
    clamped >= 90 ? "text-emerald-600 dark:text-emerald-400" : clamped >= 70 ? "text-teal-600 dark:text-teal-400" : "text-amber-600 dark:text-amber-400";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <BrainCircuit size={16} className="text-slate-400" />
          AI Confidence
        </div>
        <span className={`text-sm font-bold ${tone}`}>{clamped}%</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-gradient-brand"
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-400">
        {clamped >= 90
          ? "High confidence — result is reliable."
          : clamped >= 70
            ? "Good confidence — result is likely accurate."
            : "Lower confidence — consider a clearer photo for a more reliable read."}
      </p>
    </div>
  );
}
