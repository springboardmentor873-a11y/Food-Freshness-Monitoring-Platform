import { BarChart3, Gauge, TrendingDown, Bell } from "lucide-react";
import StatCard from "../components/shared/StatCard";
import ChartCard from "../components/shared/ChartCard";
import FreshnessTrendChart from "../components/charts/FreshnessTrendChart";
import CategoryDistributionChart from "../components/charts/CategoryDistributionChart";
import ShelfLifeChart from "../components/charts/ShelfLifeChart";
import { ANALYTICS_SUMMARY, FRESHNESS_DISTRIBUTION } from "../mocks/analytics";

const SUMMARY_ICONS = { analyzed: BarChart3, avgScore: Gauge, wasteRate: TrendingDown, alerts: Bell };

export default function AnalyticsPage() {
  const totalDistribution = FRESHNESS_DISTRIBUTION.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Freshness trends, category breakdowns, and waste-reduction insights.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ANALYTICS_SUMMARY.map((s) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            suffix={s.suffix}
            delta={s.delta}
            trend={s.trend}
            icon={SUMMARY_ICONS[s.id]}
          />
        ))}
      </div>

      <ChartCard title="Freshness Trend" subtitle="Average score across all analyzed items, last 7 days">
        <FreshnessTrendChart />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Category Distribution" subtitle="Tracked items by food category">
          <CategoryDistributionChart height={220} />
        </ChartCard>

        <ChartCard title="Avg. Shelf Life by Category" subtitle="Remaining days, current inventory">
          <ShelfLifeChart />
        </ChartCard>
      </div>

      <ChartCard title="Freshness State Distribution" subtitle="Where all tracked items currently stand">
        <div className="space-y-3">
          {FRESHNESS_DISTRIBUTION.map((d) => {
            const pct = Math.round((d.count / totalDistribution) * 100);
            return (
              <div key={d.status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{d.status}</span>
                  <span className="text-slate-400">
                    {d.count} <span className="text-xs">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-premium"
                    style={{ width: `${pct}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
