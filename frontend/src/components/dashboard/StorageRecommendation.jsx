function StorageRecommendation({ prediction }) {
  const isFresh = prediction?.freshness_status?.toLowerCase() === "fresh";

  const recommendations = [
    {
      title: "Temperature",
      value: isFresh ? "Refrigerate at 4°C" : "Cold Storage Isolation 1°C",
      desc: isFresh ? "Slows respiration & metabolism." : "Halts fungal growth.",
      color: "text-blue-600",
    },
    {
      title: "Humidity",
      value: "High (90-95%)",
      desc: "Prevents moisture loss & shriveling.",
      color: "text-indigo-600",
    },
    {
      title: "Ethylene Exposure",
      value: "Low / Isolate",
      desc: "Prevent premature ripening of adjacent crops.",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-slate-400">
        Storage & Preservation Recommendations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recommendations.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-slate-50 p-5 border border-slate-100"
          >
            <h4 className={`font-bold text-xs uppercase tracking-wider ${item.color}`}>
              {item.title}
            </h4>

            <p className="mt-2 text-lg font-extrabold text-slate-900">
              {item.value}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorageRecommendation;