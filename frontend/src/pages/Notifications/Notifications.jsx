import { useCallback, useEffect, useState } from "react";
import NotificationsHeader from "../../components/dashboard/NotificationsHeader";
import NotificationFilters from "../../components/dashboard/NotificationFilters";
import NotificationsList from "../../components/dashboard/NotificationsList";
import NotificationSummary from "../../components/dashboard/NotificationSummary";
import PageTransition from "../../components/ui/PageTransition";
import { deleteNotification, getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notifications";

function Notifications() {
  const [data, setData] = useState({ items: [], total: 0 }); const [type, setType] = useState(""); const [error, setError] = useState("");
  const load = useCallback(() => getNotifications({ notification_type: type || undefined }).then(setData).catch((requestError) => setError(requestError.response?.data?.detail || "Unable to load notifications.")), [type]);
  useEffect(() => { load(); }, [load]);
  const read = async (id) => { await markNotificationRead(id); load(); };
  const remove = async (id) => { await deleteNotification(id); load(); };
  const readAll = async () => { await markAllNotificationsRead(); load(); };
  return (
    <PageTransition>
    <div className="space-y-8">

      <NotificationsHeader />

      <NotificationFilters onMarkAllRead={readAll} onTypeChange={setType} type={type} />
      {error && <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-8">
          <NotificationsList items={data.items} onDelete={remove} onRead={read} />
        </div>

        <div className="col-span-4">
          <NotificationSummary total={data.total} unread={data.items.filter((item) => !item.is_read).length} />
        </div>

      </div>

    </div>
    </PageTransition>
  );
}

export default Notifications;
