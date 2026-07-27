const stats = [
  {
    title: "Prediction Accuracy",
    value: "98.2%",
    change: "+2.1%",
    color: "green",
    icon: "✅",
  },
  {
    title: "Fresh Foods",
    value: "88%",
    change: "+4.5%",
    color: "blue",
    icon: "🫐",
  },
  {
    title: "Spoiled Foods",
    value: "4%",
    change: "-1.5%",
    color: "red",
    icon: "⚠️",
  },
  {
    title: "Near Expiry",
    value: "8%",
    change: "+0.8%",
    color: "gray",
    icon: "⏳",
  },
];

function AnalyticsStats() {
  return (
    <div className="grid grid-cols-4 gap-6">

      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >

          <div className="mb-6 flex items-center justify-between">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-3xl">
              {item.icon}
            </div>

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                item.color === "green"
                  ? "bg-green-100 text-green-600"
                  : item.color === "blue"
                  ? "bg-blue-100 text-blue-600"
                  : item.color === "red"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {item.change}
            </span>

          </div>

          <p className="uppercase text-sm font-semibold text-gray-500">
            {item.title}
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {item.value}
          </h2>

          <div
            className={`mt-6 h-2 rounded-full ${
              item.color === "green"
                ? "bg-green-500"
                : item.color === "blue"
                ? "bg-blue-500"
                : item.color === "red"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          />

        </div>
      ))}

    </div>
  );
}

export default AnalyticsStats;