import {
  AlertTriangle,
  CheckCircle2,
  BellRing,
} from "lucide-react";

const notifications = [

  {
    id: 1,
    icon: <AlertTriangle className="text-red-500" />,
    title: "Critical Expiry Alert",
    message: "Premium Chicken will expire within 24 hours.",
    time: "5 min ago",
    color: "red",
  },

  {
    id: 2,
    icon: <BellRing className="text-orange-500" />,
    title: "Inventory Running Low",
    message: "Organic Strawberries stock is below threshold.",
    time: "30 min ago",
    color: "orange",
  },

  {
    id: 3,
    icon: <CheckCircle2 className="text-green-500" />,
    title: "AI Scan Completed",
    message: "Freshness analysis completed successfully.",
    time: "1 hour ago",
    color: "green",
  },

  {
    id: 4,
    icon: <BellRing className="text-blue-500" />,
    title: "Weekly Report Generated",
    message: "Inventory performance report is ready.",
    time: "Today",
    color: "blue",
  },

];

function NotificationsList() {
  return (

    <div className="space-y-5">

      {notifications.map((item) => (

        <div
          key={item.id}
          className="flex items-start gap-5 rounded-3xl bg-white p-6 shadow-sm"
        >

          <div
            className={`rounded-2xl p-4
            ${
              item.color === "red"
                ? "bg-red-100"
                : item.color === "green"
                ? "bg-green-100"
                : item.color === "orange"
                ? "bg-orange-100"
                : "bg-blue-100"
            }`}
          >
            {item.icon}
          </div>

          <div className="flex-1">

            <h3 className="text-xl font-semibold">
              {item.title}
            </h3>

            <p className="mt-2 text-gray-500">
              {item.message}
            </p>

          </div>

          <span className="text-sm text-gray-400">
            {item.time}
          </span>

        </div>

      ))}

    </div>
  );
}

export default NotificationsList;