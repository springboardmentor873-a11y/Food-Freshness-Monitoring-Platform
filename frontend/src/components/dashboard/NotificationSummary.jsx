import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
} from "lucide-react";

function NotificationSummary({ total, unread }) {
  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">
          Summary
        </h2>

        <div className="mt-8 space-y-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <AlertTriangle className="text-red-500" />

              <span>Critical Alerts</span>

            </div>

            <span className="font-bold">{unread}</span>

          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <BellRing className="text-orange-500" />

              <span>Warnings</span>

            </div>

            <span className="font-bold">{total - unread}</span>

          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <CheckCircle2 className="text-green-500" />

              <span>Resolved</span>

            </div>

            <span className="font-bold">{total}</span>

          </div>

        </div>

      </div>

      <div className="rounded-3xl bg-blue-600 p-8 text-white">

        <h2 className="text-2xl font-bold">
          AI Monitoring
        </h2>

        <p className="mt-4 leading-8 text-blue-100">
          AI is continuously monitoring your inventory and freshness.
        </p>

        <button className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600">
          View Dashboard
        </button>

      </div>

    </div>
  );
}

export default NotificationSummary;
