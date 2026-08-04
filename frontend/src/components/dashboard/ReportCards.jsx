import { Clock, FileDown } from "lucide-react";

function ReportCards({ downloading, onDownload }) {
  return (
    <div className="grid grid-cols-3 gap-6">

      {["pdf", "xlsx", "csv"].map((format) => (

        <div
          key={format}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >

          <div className="mb-8 flex items-center justify-between">

            <div className="rounded-xl bg-slate-100 p-3">
              <FileDown size={28} />
            </div>

            <span
              className={`rounded-full px-4 py-1 text-xs font-semibold ${
                "bg-green-100 text-green-600"
              }`}
            >
              READY
            </span>

          </div>

          <p className="text-sm uppercase text-gray-400">
            Prediction History
          </p>

          <h2 className="mt-3 text-4xl font-bold leading-tight">
            {format.toUpperCase()} Export
          </h2>

          <div className="mt-8 flex items-center gap-4 text-gray-500">

            <Clock size={18} />

            <span>Current account data</span>

          </div>

          <p className="mt-3 text-sm text-gray-500">
            Includes all prediction history
          </p>

          <button className="mt-8 w-full rounded-lg border py-2 hover:bg-gray-50 disabled:opacity-60" disabled={Boolean(downloading)} onClick={() => onDownload(format)} type="button">{downloading === format ? "Generating..." : `Download ${format.toUpperCase()}`}</button>

        </div>

      ))}

    </div>
  );
}

export default ReportCards;
