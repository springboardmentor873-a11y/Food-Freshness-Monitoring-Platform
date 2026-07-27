import { Download } from "lucide-react";

const history = [
  {
    report: "Q3 Regional Freshness Summary",
    owner: "Marcus V.",
    date: "Oct 18, 2023",
    format: "PDF",
  },

  {
    report: "Waste Reduction Analytics",
    owner: "Elena R.",
    date: "Oct 15, 2023",
    format: "XLS",
  },

  {
    report: "Supplier Grade Comparison",
    owner: "System",
    date: "Oct 12, 2023",
    format: "PDF",
  },
];

function ReportsHistory() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-8 py-6">

        <h2 className="text-2xl font-bold">
          Recent Archival History
        </h2>

        <button className="font-semibold text-blue-600">
          View All
        </button>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50 text-left text-sm uppercase text-gray-500">

          <tr>

            <th className="px-8 py-4">Report</th>

            <th>Owner</th>

            <th>Date</th>

            <th>Format</th>

            <th className="text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {history.map((item, index) => (

            <tr
              key={index}
              className="border-t"
            >

              <td className="px-8 py-6 font-medium">
                {item.report}
              </td>

              <td>{item.owner}</td>

              <td>{item.date}</td>

              <td>{item.format}</td>

              <td className="text-center">
                <button>
                  <Download size={18} />
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default ReportsHistory;