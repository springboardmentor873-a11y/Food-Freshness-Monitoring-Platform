import Card from "./Card";

function StatCard({
  title,
  value,
  icon,
  color = "green",
}) {
  const colors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Card>

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-5xl font-bold text-slate-900">
            {value}
          </h2>

        </div>

        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${colors[color]}
          `}
        >
          {icon}
        </div>

      </div>

    </Card>
  );
}

export default StatCard;