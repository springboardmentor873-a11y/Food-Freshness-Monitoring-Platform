import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import { cn } from "../../utils/cn";

const OPTIONS = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

/**
 * AppearanceSettings — theme selection. A "System" option is shown for
 * completeness but currently maps to the OS preference at first load only
 * (re-detecting live OS changes is a small addition for a later pass).
 */
export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</p>
        <p className="mt-1 text-xs text-slate-400">Choose how FreshAI looks on this device.</p>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:w-96">
          {OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-colors",
                theme === opt.id
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
              )}
            >
              <opt.icon
                size={20}
                className={theme === opt.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  theme === opt.id ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
        <Monitor size={15} className="mt-0.5 shrink-0" />
        Your preference is saved to this browser and applied automatically next time you visit.
      </div>
    </div>
  );
}
