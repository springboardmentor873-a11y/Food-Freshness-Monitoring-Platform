function SystemStatus() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        System Status
      </h2>

      <div className="space-y-5">

        <Status title="Backend API" />
        <Status title="Database" />
        <Status title="AI Prediction Service" />
        <Status title="Cloud Storage" />

      </div>

    </div>
  );
}

function Status({ title }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

      <span className="font-medium">
        {title}
      </span>

      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-600">
        Online
      </span>

    </div>
  );
}

export default SystemStatus;