import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTheme } from "../../context/ThemeProvider";
import { getChartTheme } from "../../utils/chartTheme";
import { FRESHNESS_TREND } from "../../mocks/analytics";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

/**
 * FreshnessTrendChart — average freshness score over the last 7 days,
 * as a smooth filled area line. Used on Dashboard and Analytics.
 */
export default function FreshnessTrendChart({ height = 260 }) {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  const data = useMemo(
    () => ({
      labels: FRESHNESS_TREND.labels,
      datasets: [
        {
          label: "Avg. Freshness Score",
          data: FRESHNESS_TREND.avgScore,
          borderColor: "#10B981",
          backgroundColor: (ctx) => {
            const { chart } = ctx;
            const { ctx: canvasCtx, chartArea } = chart;
            if (!chartArea) return "rgba(16,185,129,0.15)";
            const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, "rgba(16,185,129,0.28)");
            gradient.addColorStop(1, "rgba(16,185,129,0)");
            return gradient;
          },
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#10B981",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    []
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
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
            label: (ctx) => `Score: ${ctx.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: theme.textColor, font: { size: 11 } },
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: theme.gridColor },
          ticks: { color: theme.textColor, font: { size: 11 }, stepSize: 25 },
        },
      },
    }),
    [theme]
  );

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}
