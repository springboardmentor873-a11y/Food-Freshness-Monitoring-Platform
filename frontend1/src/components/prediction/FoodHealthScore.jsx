import GaugeMeter from "../ui/GaugeMeter";

function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 65) return "C";
  if (score >= 45) return "D";
  return "F";
}

/**
 * FoodHealthScore — overall composite score (visual condition + storage +
 * shelf-life + product age), shown with a letter grade for instant scanning.
 */
export default function FoodHealthScore({ score = 0 }) {
  return (
    <div className="flex items-center gap-5">
      <GaugeMeter value={score} size={92} strokeWidth={8} valueSuffix="" />
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Food Health Score</p>
        <p className="mt-0.5 text-2xl font-extrabold text-slate-900 dark:text-white">
          Grade {letterGrade(score)}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          Weighted: visual condition, storage, shelf-life, product age
        </p>
      </div>
    </div>
  );
}
