import Card from "../ui/Card";
import { Eye, Thermometer, Clock, Calendar, HelpCircle } from "lucide-react";

export default function WeightedScoringBreakdownCard({
  visualScore = 92,
  storageScore = 85,
  shelfLifeScore = 80,
  productAgeScore = 90,
}) {
  // Weighted scoring formula from PDF spec:
  // Visual Condition Analysis (40%)
  // Storage Conditions (25%)
  // Shelf-Life Prediction (20%)
  // Product Age (15%)
  const visualContrib = visualScore * 0.4;
  const storageContrib = storageScore * 0.25;
  const shelfLifeContrib = shelfLifeScore * 0.2;
  const ageContrib = productAgeScore * 0.15;

  const totalCalculatedScore = Math.round(visualContrib + storageContrib + shelfLifeContrib + ageContrib);

  const metrics = [
    {
      name: "Visual Condition Analysis",
      weight: "40%",
      score: visualScore,
      contrib: visualContrib.toFixed(1),
      icon: Eye,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      description: "Color degradation, surface texture, mold & bruising detection",
    },
    {
      name: "Storage Conditions",
      weight: "25%",
      score: storageScore,
      contrib: storageContrib.toFixed(1),
      icon: Thermometer,
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      description: "Temperature, humidity, air circulation & light exposure compliance",
    },
    {
      name: "Shelf-Life Prediction",
      weight: "20%",
      score: shelfLifeScore,
      contrib: shelfLifeContrib.toFixed(1),
      icon: Clock,
      color: "bg-purple-500",
      textColor: "text-purple-600 dark:text-purple-400",
      description: "Estimated days remaining based on degradation velocity curve",
    },
    {
      name: "Product Age",
      weight: "15%",
      score: productAgeScore,
      contrib: ageContrib.toFixed(1),
      icon: Calendar,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
      description: "Elapsed days since purchase/pack date relative to baseline shelf life",
    },
  ];

  return (
    <Card>
      <Card.Header
        title="Weighted Scoring Engine Model"
        subtitle="Freshness Score = Visual (40%) + Storage (25%) + Shelf-Life (20%) + Product Age (15%)"
        action={
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Total Score: {totalCalculatedScore}/100
          </div>
        }
      />

      <div className="space-y-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.name}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl text-white ${m.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {m.name}
                      </span>
                      <span className="rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        Weight: {m.weight}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-extrabold ${m.textColor}`}>{m.score}</span>
                  <span className="text-xs text-slate-400 block">+{m.contrib} pts</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-700/60 mt-2">
                <div
                  className={`h-full rounded-full ${m.color} transition-all duration-700 ease-out`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
        <HelpCircle size={16} className="shrink-0 mt-0.5" />
        <span>
          <strong>Scoring Formula:</strong> (Visual Condition × 0.40) + (Storage Condition × 0.25) + (Shelf Life × 0.20) + (Product Age × 0.15) = <strong>{totalCalculatedScore} / 100</strong>
        </span>
      </div>
    </Card>
  );
}
