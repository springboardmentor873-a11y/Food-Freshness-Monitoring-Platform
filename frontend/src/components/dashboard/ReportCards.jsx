import {
  TrendingUp,
  Database,
  Package,
  Clock,
} from "lucide-react";

const reports = [
  {
    icon: <TrendingUp size={28} />,
    title: "Prediction Report",
    name: "Weekly Accuracy & Throughput",
    date: "Oct 24, 2023",
    size: "12.4 MB",
    status: "READY",
    color: "green",
  },

  {
    icon: <Database size={28} />,
    title: "Inventory Report",
    name: "Monthly Global Stock Analysis",
    date: "Oct 22, 2023",
    size: "Generating...",
    status: "GENERATING",
    color: "blue",
  },

  {
    icon: <Package size={28} />,
    title: "Shelf Life Report",
    name: "Perishables Optimization Study",
    date: "Oct 20, 2023",
    size: "8.1 MB",
    status: "READY",
    color: "green",
  },
];

function ReportCards() {
  return (
    <div className="grid grid-cols-3 gap-6">

      {reports.map((report, index) => (

        <div
          key={index}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >

          <div className="mb-8 flex items-center justify-between">

            <div className="rounded-xl bg-slate-100 p-3">
              {report.icon}
            </div>

            <span
              className={`rounded-full px-4 py-1 text-xs font-semibold ${
                report.color === "green"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {report.status}
            </span>

          </div>

          <p className="text-sm uppercase text-gray-400">
            {report.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold leading-tight">
            {report.name}
          </h2>

          <div className="mt-8 flex items-center gap-4 text-gray-500">

            <Clock size={18} />

            <span>{report.date}</span>

          </div>

          <p className="mt-3 text-sm text-gray-500">
            {report.size}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">

            <button className="rounded-lg border py-2 hover:bg-gray-50">
              PDF
            </button>

            <button className="rounded-lg border py-2 hover:bg-gray-50">
              Excel
            </button>

            <button className="rounded-lg border py-2 hover:bg-gray-50">
              Print
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}

export default ReportCards;