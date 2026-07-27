function FreshnessChart() {
  const bars = [80, 92, 88, 115, 135, 125, 160];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-10 flex justify-between">

        <div>
          <h2 className="text-4xl font-bold">
            Freshness Trends
          </h2>

          <p className="mt-2 text-gray-500">
            Average shelf-life rating over last 30 days
          </p>
        </div>

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-500" />
            Dairy
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500" />
            Produce
          </div>

        </div>

      </div>

      <div className="flex h-80 items-end justify-between">

        {bars.map((bar, index) => (
          <div key={index} className="flex flex-col items-center">

            <div
              className="w-16 rounded-t-xl bg-green-300"
              style={{ height: `${bar}px` }}
            />

            <p className="mt-3 text-sm text-gray-500">
              Week {index + 1}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default FreshnessChart;