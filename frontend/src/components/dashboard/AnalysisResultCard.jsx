function AnalysisResultCard() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

      {/* Image Section */}

      <div className="relative">

        {/* Fresh Badge */}

        <div className="absolute left-5 top-5 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow">
          ✓ FRESH
        </div>

        {/* Placeholder Image */}

        <img
          src="https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=900"
          alt="Food"
          className="h-[500px] w-full object-cover"
        />

      </div>

      {/* Details */}

      <div className="flex items-center justify-between p-6">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            Hass Avocados
          </h2>

          <p className="mt-1 text-gray-500">
            Batch #AV-2024-009
          </p>

        </div>

        {/* Settings */}

        <button className="flex h-12 w-12 items-center justify-center rounded-xl border text-2xl hover:bg-gray-100">
          ⚙️
        </button>

      </div>

    </div>
  );
}

export default AnalysisResultCard;