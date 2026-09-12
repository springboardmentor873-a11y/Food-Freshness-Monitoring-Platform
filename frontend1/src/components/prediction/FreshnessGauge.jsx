import GaugeMeter from "../ui/GaugeMeter";
import { cn } from "../../utils/cn";

const CATEGORY_BADGE = {
  Fresh: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Good: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  Acceptable: "bg-lime-50 text-lime-700 dark:bg-lime-500/10 dark:text-lime-400",
  "Near Spoilage": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Spoiled: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};

/**
 * FreshnessGauge — the primary result visualization. Score 0-100 mapped
 * to a 5-state freshness category badge underneath the ring.
 */
export default function FreshnessGauge({ score, category, className }) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <GaugeMeter value={score} size={180} strokeWidth={14} sublabel="Freshness Score" />
      <span
        className={cn(
          "mt-4 rounded-full px-3.5 py-1 text-sm font-semibold",
          CATEGORY_BADGE[category] || CATEGORY_BADGE.Acceptable
        )}
      >
        {category}
      </span>
    </div>
  );
}
