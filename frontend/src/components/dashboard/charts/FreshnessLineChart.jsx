import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { freshnessData } from "../../../data/dashboardData";

function FreshnessLineChart() {
  return (
    <ResponsiveContainer
      width="100%"
      height={320}
    >
      <LineChart data={freshnessData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="day" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="fresh"
          stroke="#16A34A"
          strokeWidth={3}
        />

        <Line
          type="monotone"
          dataKey="spoiled"
          stroke="#EF4444"
          strokeWidth={3}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}

export default FreshnessLineChart;