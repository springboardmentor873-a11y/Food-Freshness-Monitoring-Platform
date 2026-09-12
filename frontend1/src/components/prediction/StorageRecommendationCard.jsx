import { Thermometer, Droplets, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import Card from "../ui/Card";

/**
 * StorageRecommendationCard — AI-generated storage guidance from backend API,
 * including recommended conditions, temperature/humidity guidance, and advice.
 */
export default function StorageRecommendationCard({ storage, recommendation, shelfLifeDays, issues = [] }) {
  const tips = storage?.tips || (recommendation ? recommendation.split(". ").filter(Boolean) : []);

  return (
    <Card>
      <Card.Header
        title="AI Storage Recommendation"
        action={
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
            <Sparkles size={16} />
          </span>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Thermometer size={13} className="text-emerald-500" /> Temp Guidance
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {storage?.recommendedTemp || storage?.currentTemp || storage?.temperature || "1.0 - 4.0°C"}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Droplets size={13} className="text-blue-500" /> Humidity Guidance
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {storage?.recommendedHumidity || storage?.currentHumidity || storage?.humidity || "80 - 90%"}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <ShieldCheck size={13} className="text-purple-500" /> Remaining Shelf Life
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {shelfLifeDays != null ? `${shelfLifeDays} day(s)` : "7 day(s)"}
          </p>
        </div>
      </div>

      {recommendation && (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-500/10">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300 mb-1">
            Backend AI Advice & Recommendation:
          </p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
            {recommendation}
          </p>
        </div>
      )}

      {tips.length > 0 && !recommendation && (
        <ul className="mt-4 space-y-2.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {tip}
            </li>
          ))}
        </ul>
      )}

      {issues.length > 0 && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-900 dark:bg-amber-500/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <AlertTriangle size={13} /> Storage & Health Alerts
          </div>
          <ul className="mt-2 space-y-1">
            {issues.map((issue, i) => (
              <li key={i} className="text-sm text-amber-700 dark:text-amber-300">
                • {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

