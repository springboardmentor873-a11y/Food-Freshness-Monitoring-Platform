const recommendations = [
  {
    title: "Temperature",
    value: "Refrigerate at 4°C",
    desc: "Slows metabolism.",
  },
  {
    title: "Humidity",
    value: "High (90-95%)",
    desc: "Prevents shriveling.",
  },
  {
    title: "Exposure",
    value: "Ethylene Low",
    desc: "Isolate from fruit.",
  },
];

function StorageRecommendation() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h3 className="mb-8 text-lg font-bold uppercase tracking-wide">
        Storage Recommendations
      </h3>

      <div className="grid grid-cols-3 gap-5">
        {recommendations.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-gray-50 p-5"
          >
            <h4 className="font-semibold text-blue-600">
              {item.title}
            </h4>

            <p className="mt-4 text-xl font-bold">
              {item.value}
            </p>

            <p className="mt-2 text-gray-500">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorageRecommendation;