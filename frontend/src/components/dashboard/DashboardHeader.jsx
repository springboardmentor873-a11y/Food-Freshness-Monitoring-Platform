import { ScanLine, Upload, FileText } from "lucide-react";

function DashboardHeader() {
  return (
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Section */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Operations Overview
        </h1>

        <p className="mt-2 text-gray-500">
          Live quality monitoring and freshness distribution analytics.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-wrap gap-4">
        <button className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700">
          <ScanLine size={18} />
          Scan Food
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
          <Upload size={18} />
          Upload Image
        </button>

        <button className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100">
          <FileText size={18} />
          Generate Report
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;