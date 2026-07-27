function NotificationFilters() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex gap-3">

          <button className="rounded-xl bg-blue-600 px-5 py-2 text-white">
            All
          </button>

          <button className="rounded-xl bg-slate-100 px-5 py-2">
            Critical
          </button>

          <button className="rounded-xl bg-slate-100 px-5 py-2">
            Warning
          </button>

          <button className="rounded-xl bg-slate-100 px-5 py-2">
            Info
          </button>

        </div>

        <button className="rounded-xl border px-5 py-2">
          Mark All Read
        </button>

      </div>

    </div>
  );
}

export default NotificationFilters;