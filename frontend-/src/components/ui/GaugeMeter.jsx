import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const DEFAULT_STOPS = [
  { min: 85, color: "#10B981" }, // fresh / emerald
  { min: 70, color: "#14B8A6" }, // good / teal
  { min: 50, color: "#84CC16" }, // acceptable / lime
  { min: 25, color: "#F59E0B" }, // near spoilage / amber
  { min: 0, color: "#F43F5E" }, // spoiled / rose
];

function resolveColor(value, stops) {
  const match = stops.find((s) => value >= s.min);
  return match ? match.color : stops[stops.length - 1].color;
}

/**
 * GaugeMeter — the single circular-progress primitive used by FreshnessGauge,
 * ConfidenceMeter, and FoodHealthScore. Same SVG, motion, and label treatment
 * everywhere it appears; only value/size/colorStops/label change per use.
 */
export default function GaugeMeter({
  value = 0,
  size = 160,
  strokeWidth = 12,
  colorStops = DEFAULT_STOPS,
  label,
  sublabel,
  valueSuffix = "%",
  className,
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = resolveColor(clamped, colorStops);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-slate-100 dark:stroke-slate-800"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {Math.round(clamped)}
            <span className="text-lg font-semibold text-slate-400">{valueSuffix}</span>
          </span>
          {sublabel && (
            <span className="mt-0.5 text-xs font-medium text-slate-400">{sublabel}</span>
          )}
        </div>
      </div>

      {label && (
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      )}
    </div>
  );
}

export { DEFAULT_STOPS as FRESHNESS_COLOR_STOPS };
