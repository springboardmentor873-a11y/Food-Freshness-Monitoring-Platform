import { Clock, AlertCircle } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * ShelfLifeCountdown — remaining shelf life framed as an urgency signal,
 * not just a number. Color and copy shift as days run out.
 */
export default function ShelfLifeCountdown({ days = 0 }) {
  const isUrgent = days <= 1;
  const isSpoiled = days <= 0;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + Math.max(days, 0));

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4",
        isSpoiled
          ? "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-500/10"
          : isUrgent
            ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-500/10"
            : "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-500/10"
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-glow",
          isSpoiled ? "bg-rose-500" : isUrgent ? "bg-amber-500" : "bg-gradient-brand"
        )}
      >
        {isSpoiled ? <AlertCircle size={20} /> : <Clock size={20} />}
      </span>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {isSpoiled ? "Already spoiled" : days === 1 ? "1 day left" : `${days} days left`}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSpoiled
            ? "Recommend discarding this item."
            : `Best consumed by ${expiryDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`}
        </p>
      </div>
    </div>
  );
}
