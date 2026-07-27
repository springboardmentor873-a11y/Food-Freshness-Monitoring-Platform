import { HardDrive } from "lucide-react";

function ReportsSidebar() {
  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-blue-600 p-8 text-white">

        <h2 className="text-3xl font-bold">
          Automate Reporting
        </h2>

        <p className="mt-4 leading-8 text-blue-100">
          Set up recurring deliveries to your stakeholders every Monday morning.
        </p>

        <button className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600">
          Configure Schedule
        </button>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <div className="flex items-center gap-3">

          <HardDrive />

          <h3 className="text-xl font-bold">
            Storage Consumption
          </h3>

        </div>

        <p className="mt-8 text-gray-500">
          Used 45.2 GB / 60 GB
        </p>

        <div className="mt-5 h-3 rounded-full bg-gray-200">

          <div className="h-3 w-3/4 rounded-full bg-blue-600"></div>

        </div>

        <p className="mt-6 text-sm text-gray-400">
          Your organization is approaching its storage limit.
          Old reports are automatically archived after 365 days.
        </p>

      </div>

    </div>
  );
}

export default ReportsSidebar;