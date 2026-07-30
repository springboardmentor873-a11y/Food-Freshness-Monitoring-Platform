import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export const ANALYSIS_STEPS = [
  "Uploading image",
  "Analyzing visual condition",
  "Detecting spoilage indicators",
  "Calculating freshness score",
  "Generating recommendations",
];

/**
 * AnalysisProgress — sequential step indicator shown while a mock (or real)
 * analysis request is in flight. `currentStep` is the index of the active step.
 */
export default function AnalysisProgress({ currentStep }) {
  return (
    <div className="mx-auto max-w-sm space-y-3">
      {ANALYSIS_STEPS.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={step} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                isDone
                  ? "bg-emerald-500 text-white"
                  : isActive
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
              )}
            >
              {isDone ? (
                <Check size={13} />
              ) : isActive ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                i + 1
              )}
            </span>
            <motion.p
              animate={{ opacity: isDone || isActive ? 1 : 0.5 }}
              className={cn(
                "text-sm",
                isActive ? "font-semibold text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
              )}
            >
              {step}
            </motion.p>
          </div>
        );
      })}
    </div>
  );
}
