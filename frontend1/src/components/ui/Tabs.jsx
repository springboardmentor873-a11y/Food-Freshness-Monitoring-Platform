import { cn } from "../../utils/cn";

/**
 * Tabs — underline-style tab switcher. Used on Notifications (filter tabs)
 * and Settings (Profile / Appearance / Security).
 */
export default function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn("flex gap-1 overflow-x-auto border-b border-slate-100 no-scrollbar dark:border-slate-800", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gradient-brand" />
            )}
          </button>
        );
      })}
    </div>
  );
}
