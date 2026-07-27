function HistoricalTrend() {
  const bars = [55, 62, 78, 74, 88, 82, 94];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase tracking-wide">
          Historical Quality Trend
        </h2>

        <button className="font-semibold text-blue-600">
          View Details →
        </button>
      </div>

      <div className="flex h-72 items-end justify-between">
        {bars.map((height, index) => (
          <div
            key={index}
            className="flex w-20 flex-col items-center"
          >
            <div
              className={`w-full rounded-t-xl ${
                index === bars.length - 1
                  ? "bg-green-500"
                  : "bg-green-200"
              }`}
              style={{
                height: `${height * 2}px`,
              }}
            />

            <p className="mt-3 text-sm text-gray-500">
              {index === bars.length - 1
                ? "Current"
                : `Batch ${index + 1}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoricalTrend;