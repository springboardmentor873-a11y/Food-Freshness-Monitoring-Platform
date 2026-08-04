import { CalendarDays, FileDown } from "lucide-react";

function ReportsHeader({ onGenerate }) {
  return (
    <div className="flex items-start justify-between">

      <div>
        <h1 className="text-5xl font-bold text-slate-900">
          Quality & Inventory Reports
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          Manage and export system-generated audits and AI freshness
          predictions.
        </p>
      </div>

      <div className="flex gap-4">

        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium shadow-sm">
          <CalendarDays size={18} />
          Last 30 Days
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow" onClick={onGenerate} type="button">
          <FileDown size={18} />
          Generate Report
        </button>

      </div>

    </div>
  );
}

export default ReportsHeader;
