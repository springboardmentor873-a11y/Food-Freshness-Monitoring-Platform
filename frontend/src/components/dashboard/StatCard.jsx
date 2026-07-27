function StatCard({
  title,
  value,
  percentage,
  percentageColor,
  icon: Icon,
  iconColor,
  iconBg,
}) {
  return (
    <div className="min-h-[150px] rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="flex items-start justify-between">

        {/* Left Section */}
        <div>
          <p className="whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-gray-500">
            {title}
          </p>

          <div className="mt-4 flex items-end gap-3">
            <h2 className="text-4xl font-bold text-slate-900">
              {value}
            </h2>

            {percentage && (
              <span
                className={`mb-1 text-sm font-semibold ${percentageColor}`}
              >
                {percentage}
              </span>
            )}
          </div>
        </div>

        {/* Icon */}
        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Icon
            size={24}
            className={iconColor}
          />
        </div>

      </div>
    </div>
  );
}

export default StatCard;