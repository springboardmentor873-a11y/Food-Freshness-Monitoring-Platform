import { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeProvider";
import { getChartTheme } from "../../utils/chartTheme";
import { SHELF_LIFE_BY_CATEGORY } from "../../mocks/analytics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/**
 * ShelfLifeChart — average remaining shelf-life (days) by food category.
 */
export default function ShelfLifeChart({ height = 260 }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  const data = useMemo(
    () => ({
      labels: SHELF_LIFE_BY_CATEGORY.labels,
      datasets: [
        {
          label: "Avg. Days Remaining",
          data: SHELF_LIFE_BY_CATEGORY.avgDaysRemaining,
          backgroundColor: "#14B8A6",
          hoverBackgroundColor: "#0D9488",
          borderRadius: 8,
          maxBarThickness: 36,
        },
      ],
    }),
    []
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
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
          displayColors: false,
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} days avg.`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: theme.textColor, font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: theme.gridColor },
          ticks: { color: theme.textColor, font: { size: 11 } },
        },
      },
    }),
    [theme]
  );

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
