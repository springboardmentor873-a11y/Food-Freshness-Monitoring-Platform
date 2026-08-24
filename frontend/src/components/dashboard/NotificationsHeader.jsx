import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotificationsHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Notifications Center
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor real-time sensor anomalies, expiration reminders, and AI spoilage alerts.
        </p>
      </div>

      <button
        onClick={() => navigate("/profile")}
        type="button"
        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer self-start sm:self-auto"
      >
        <Settings size={16} />
        Notification Preferences
      </button>
    </div>
  );
}

export default NotificationsHeader;