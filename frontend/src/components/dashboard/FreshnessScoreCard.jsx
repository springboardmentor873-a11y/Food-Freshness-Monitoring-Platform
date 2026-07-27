function FreshnessScoreCard() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6">
        <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-600">
          Optimal Quality
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* Circle */}
        <div className="flex h-44 w-44 items-center justify-center rounded-full border-[10px] border-green-500">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-green-600">94%</h1>
            <p className="font-semibold text-gray-500">FRESHNESS</p>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h2 className="mb-4 text-4xl font-bold text-slate-900">
            Peak Consumption Window
          </h2>

          <p className="text-lg leading-8 text-gray-500">
            The internal lipid structure and skin oxidation levels indicate
            this batch is currently in its prime consumption window with
            minimal degradation.
          </p>

          <p className="mt-4 text-lg font-semibold text-green-600">
            Suggested immediate rotation to premium display.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FreshnessScoreCard;