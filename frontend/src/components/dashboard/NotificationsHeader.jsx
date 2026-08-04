import { Settings } from "lucide-react";


function NotificationsHeader() {
  return (
    <div className="flex items-start justify-between">

      <div>
        <h1 className="text-5xl font-bold text-slate-900">
          Notifications Center
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          Monitor system alerts, AI predictions and inventory updates.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <Settings size={18} />
        Notification Settings
      </button>

    </div>
  );
}

export default NotificationsHeader;