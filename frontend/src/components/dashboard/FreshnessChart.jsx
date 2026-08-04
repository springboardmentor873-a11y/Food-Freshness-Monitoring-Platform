import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function FreshnessChart({ data }) {

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-10 flex justify-between">

        <div>
          <h2 className="text-4xl font-bold">
            Freshness Trends
          </h2>

          <p className="mt-2 text-gray-500">
            Daily fresh and spoiled predictions
          </p>
        </div>


      </div>

      <div className="h-80">{data.length ? <ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="fresh" fill="#22c55e" /><Bar dataKey="spoiled" fill="#ef4444" /></BarChart></ResponsiveContainer> : <p className="pt-24 text-center text-gray-500">No prediction data for this period.</p>}</div>

    </div>
  );
}

export default FreshnessChart;
