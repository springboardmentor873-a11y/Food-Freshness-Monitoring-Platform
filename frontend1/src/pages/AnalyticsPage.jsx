import { useEffect, useState } from "react";
import { BarChart3, Gauge, TrendingDown, Bell } from "lucide-react";
import StatCard from "../components/shared/StatCard";
import ChartCard from "../components/shared/ChartCard";
import FreshnessTrendChart from "../components/charts/FreshnessTrendChart";
import CategoryDistributionChart from "../components/charts/CategoryDistributionChart";
import ShelfLifeChart from "../components/charts/ShelfLifeChart";
import { ANALYTICS_SUMMARY as MOCK_SUMMARY, FRESHNESS_DISTRIBUTION as MOCK_DISTRIBUTION } from "../mocks/analytics";
import { apiService } from "../services/api";

const SUMMARY_ICONS = { analyzed: BarChart3, avgScore: Gauge, wasteRate: TrendingDown, alerts: Bell };

export default function AnalyticsPage() {
  const [summaryCards, setSummaryCards] = useState(MOCK_SUMMARY);
  const [freshnessDist, setFreshnessDist] = useState(MOCK_DISTRIBUTION);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await apiService.getAnalyticsSummary();
        if (data) {
          setSummaryCards([
            { id: "analyzed", label: "Total Food Analyzed", value: String(data.total_analyses), suffix: " items", delta: "Real DB count", trend: "up" },
            { id: "avgScore", label: "Avg Freshness Score", value: String(data.average_freshness_score), suffix: "%", delta: `${data.fresh_count} fresh items`, trend: "up" },
            { id: "wasteRate", label: "Spoilage Rate", value: data.total_analyses ? String(Math.round((data.spoiled_count / data.total_analyses) * 100)) : "0", suffix: "%", delta: `${data.spoiled_count} spoiled items`, trend: "down" },
            { id: "alerts", label: "Items Near Expiry", value: String(data.items_near_expiry), suffix: " alerts", delta: "Inventory check", trend: "down" },
          ]);

          if (data.risk_distribution && data.risk_distribution.length > 0) {
            setFreshnessDist(data.risk_distribution);
          }
        }
      } catch (err) {
        console.warn("[AnalyticsPage] Using fallback mock summary:", err);
      }
    }

    fetchAnalytics();
  }, []);

  const totalDistribution = freshnessDist.reduce((sum, d) => sum + (d.count || 0), 0) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time freshness trends, category breakdowns, and database-backed insights.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((s) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            suffix={s.suffix}
            delta={s.delta}
            trend={s.trend}
            icon={SUMMARY_ICONS[s.id] || BarChart3}
          />
        ))}
      </div>

      <ChartCard title="Freshness Trend" subtitle="Average score across all analyzed items">
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
          {freshnessDist.map((d) => {
            const pct = Math.round(((d.count || 0) / totalDistribution) * 100);
            return (
              <div key={d.status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{d.status}</span>
                  <span className="text-slate-400">
                    {d.count || 0} <span className="text-xs">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-premium"
                    style={{ width: `${pct}%`, backgroundColor: d.color || "#10B981" }}
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
