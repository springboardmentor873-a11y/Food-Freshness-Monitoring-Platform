/**
 * getChartTheme — returns Chart.js color tokens matched to the current
 * app theme. Chart.js can't read Tailwind's `dark:` classes directly,
 * so every chart pulls its grid/text/tooltip colors from here.
 */
export function getChartTheme(isDark) {
  return {
    textColor: isDark ? "#94A3B8" : "#64748B",
    gridColor: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(100, 116, 139, 0.08)",
    tooltipBg: isDark ? "#1E293B" : "#FFFFFF",
    tooltipText: isDark ? "#F1F5F9" : "#0F172A",
    tooltipBorder: isDark ? "#334155" : "#E2E8F0",
  };
}
