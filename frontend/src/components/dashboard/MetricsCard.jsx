function MetricsCard() {
  const metrics = [
    {
      title: "AI Confidence",
      value: "98.2%",
      icon: "🧠",
      color: "bg-blue-100",
    },
    {
      title: "Est. Shelf Life",
      value: "5 Days",
      icon: "📅",
      color: "bg-red-100",
    },
  ];

  return (
    <>
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-3xl">
            {metric.icon}
          </div>

          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {metric.title}
          </p>

          <h2 className="mt-2 text-4xl font-bold">{metric.value}</h2>
        </div>
      ))}
    </>
  );
}

export default MetricsCard;