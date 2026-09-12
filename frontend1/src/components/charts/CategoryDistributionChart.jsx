import { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeProvider";
import { getChartTheme } from "../../utils/chartTheme";
import { CATEGORY_BREAKDOWN } from "../../mocks/analytics";

ChartJS.register(ArcElement, Tooltip);

/**
 * CategoryDistributionChart — donut showing inventory split by food category,
 * with a matching color-keyed legend (Chart.js legend is disabled in favor
 * of a custom one for tighter visual control).
 */
export default function CategoryDistributionChart({ height = 260 }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);
  const total = CATEGORY_BREAKDOWN.reduce((sum, c) => sum + c.count, 0);

  const data = useMemo(
    () => ({
      labels: CATEGORY_BREAKDOWN.map((c) => c.category),
      datasets: [
        {
          data: CATEGORY_BREAKDOWN.map((c) => c.count),
          backgroundColor: CATEGORY_BREAKDOWN.map((c) => c.color),
          borderColor: isDark ? "#0F172A" : "#FFFFFF",
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    }),
    [isDark]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.tooltipBg,
          titleColor: theme.tooltipText,
          bodyColor: theme.tooltipText,
          borderColor: theme.tooltipBorder,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 10,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed} items`,
          },
        },
      },
    }),
    [theme]
  );

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative shrink-0" style={{ height, width: height }}>
        <Doughnut data={data} options={options} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{total}</span>
          <span className="text-xs text-slate-400">Total Items</span>
        </div>
      </div>

      <ul className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2.5">
        {CATEGORY_BREAKDOWN.map((c) => (
          <li key={c.category} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="truncate text-slate-500 dark:text-slate-400">{c.category}</span>
            <span className="ml-auto shrink-0 font-semibold text-slate-700 dark:text-slate-200">{c.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
