import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444"];

function WasteReduction({ data }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="text-4xl font-bold">
        Category Distribution
      </h2>

      <p className="mt-2 text-gray-500">
        Inventory items by food category
      </p>

      <div className="mt-8 h-72">{data.length ? <ResponsiveContainer><PieChart><Pie data={data} dataKey="count" nameKey="category" outerRadius={90}>{data.map((item, index) => <Cell fill={COLORS[index % COLORS.length]} key={item.category} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer> : <p className="pt-20 text-center text-gray-500">No inventory categories yet.</p>}</div>

    </div>
  );
}

export default WasteReduction;
