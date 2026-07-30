import { Thermometer, Droplets, Sparkles, AlertTriangle } from "lucide-react";
import Card from "../ui/Card";

/**
 * StorageRecommendationCard — AI-generated storage guidance for the analyzed item,
 * plus any detected issues flagged during image analysis.
 */
export default function StorageRecommendationCard({ storage, issues = [] }) {
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

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Thermometer size={13} /> Temperature
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {storage?.temperature || "N/A"}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Droplets size={13} /> Humidity
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {storage?.humidity || "N/A"}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {storage?.tips?.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            {tip}
          </li>
        ))}
      </ul>

      {issues.length > 0 && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-900 dark:bg-amber-500/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <AlertTriangle size={13} /> Detected Issues
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
