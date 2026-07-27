function NotificationPreferences() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-3xl font-bold">
        Notification Preferences
      </h2>

      <div className="space-y-5">

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">
          <div>
            <h3 className="font-semibold">
              Email Alerts
            </h3>

            <p className="text-gray-500">
              Daily quality reports.
            </p>
          </div>

          <input type="checkbox" defaultChecked />
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">
          <div>
            <h3 className="font-semibold">
              Push Notifications
            </h3>

            <p className="text-gray-500">
              Real-time alerts.
            </p>
          </div>

          <input type="checkbox" />
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-green-50 p-5">
          <div>
            <h3 className="font-semibold text-green-700">
              Critical Spoilage Alerts
            </h3>

            <p className="text-green-600">
              Emergency notifications.
            </p>
          </div>

          <input type="checkbox" defaultChecked />
        </div>

      </div>

    </div>
  );
}

export default NotificationPreferences;