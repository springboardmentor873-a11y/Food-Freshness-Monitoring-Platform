import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../ui/Card";
import { cn } from "../../utils/cn";

/**
 * StatCard — animated stat/metric card used on Dashboard, Analytics, Inventory.
 * Counts up from 0 to `value` on mount.
 */
export default function StatCard({ label, value, suffix = "", delta, trend = "up", icon: Icon }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <Card hoverable padding="md" className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {display.toLocaleString()}
            {suffix}
          </p>
        </div>
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
            <Icon size={18} />
          </span>
        )}
      </div>

      {delta && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
            trend === "up"
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          )}
        >
          {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
          <span className="font-normal text-slate-400">vs last week</span>
        </div>
      )}
    </Card>
  );
}
