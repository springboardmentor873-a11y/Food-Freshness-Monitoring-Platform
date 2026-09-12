import { AlertTriangle, Clock, Thermometer, Info } from "lucide-react";
import { cn } from "../../utils/cn";

const TYPE_CONFIG = {
  spoilage: { icon: AlertTriangle, color: "rose" },
  shelfLife: { icon: Clock, color: "amber" },
  storage: { icon: Thermometer, color: "teal" },
  system: { icon: Info, color: "emerald" },
};

const COLOR_CLASSES = {
  rose: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400",
  teal: "bg-teal-50 text-teal-500 dark:bg-teal-500/10 dark:text-teal-400",
  emerald: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400",
};

/**
 * NotificationCard — single notification row. Used in both the full
 * Notifications page and the Navbar's NotificationCenter dropdown.
 */
export default function NotificationCard({ notification, onClick, compact = false }) {
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.icon;

  return (
    <button
      onClick={() => onClick?.(notification)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60",
        !notification.isRead && "bg-emerald-50/40 dark:bg-emerald-500/5"
      )}
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", COLOR_CLASSES[config.color])}>
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {notification.title}
          </p>
          {!notification.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
        </div>
        <p className={cn("mt-0.5 text-slate-500 dark:text-slate-400", compact ? "line-clamp-1 text-xs" : "text-sm")}>
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-slate-400">{notification.time}</p>
      </div>
    </button>
  );
}
