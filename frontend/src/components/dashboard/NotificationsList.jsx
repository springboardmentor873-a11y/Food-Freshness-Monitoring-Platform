import {
  AlertTriangle,
  CheckCircle2,
  BellRing,
} from "lucide-react";

function NotificationsList({ items, onDelete, onRead }) {
  return (

    <div className="space-y-5">

      {!items.length && <p className="rounded-3xl bg-white p-6 text-gray-500 shadow-sm">No notifications found.</p>}
      {items.map((item) => (

        <div
          key={item.id}
          className="flex items-start gap-5 rounded-3xl bg-white p-6 shadow-sm"
        >

          <div
            className={`rounded-2xl p-4
            ${
              item.notification_type === "spoiled_food_alert"
                ? "bg-red-100"
                : item.notification_type === "prediction_completed"
                ? "bg-green-100"
                : item.notification_type === "expiry_reminder"
                ? "bg-orange-100"
                : "bg-blue-100"
            }`}
          >
            {item.notification_type === "spoiled_food_alert" ? <AlertTriangle className="text-red-500" /> : item.notification_type === "prediction_completed" ? <CheckCircle2 className="text-green-500" /> : <BellRing className="text-blue-500" />}
          </div>

          <div className="flex-1">

            <h3 className={`text-xl font-semibold ${item.is_read ? "" : "text-blue-700"}`}>
              {item.title}
            </h3>

            <p className="mt-2 text-gray-500">
              {item.message}
            </p>

          </div>

          <span className="text-sm text-gray-400">
            {new Date(item.created_at).toLocaleString()}
          </span>
          <div className="flex gap-2"><button disabled={item.is_read} onClick={() => onRead(item.id)} type="button">Read</button><button className="text-red-600" onClick={() => onDelete(item.id)} type="button">Delete</button></div>

        </div>

      ))}

    </div>
  );
}

export default NotificationsList;
