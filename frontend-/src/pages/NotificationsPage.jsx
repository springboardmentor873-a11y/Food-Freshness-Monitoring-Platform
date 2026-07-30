import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import EmptyState from "../components/ui/EmptyState";
import NotificationCard from "../components/notifications/NotificationCard";
import { useNotifications } from "../context/NotificationsProvider";
import { NOTIFICATION_TYPES } from "../mocks/notifications";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = useMemo(() => {
    const counts = { all: notifications.length };
    Object.keys(NOTIFICATION_TYPES).forEach((type) => {
      counts[type] = notifications.filter((n) => n.type === type).length;
    });
    return [
      { id: "all", label: "All", count: counts.all },
      ...Object.entries(NOTIFICATION_TYPES).map(([id, cfg]) => ({
        id,
        label: cfg.label,
        count: counts[id],
      })),
    ];
  }, [notifications]);

  const filtered = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" leftIcon={<CheckCheck size={16} />} onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Card padding="none">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="px-3" />

        <div className="p-2">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Nothing here"
              description="No notifications in this category right now."
              className="border-none py-14"
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((n) => (
                <NotificationCard key={n.id} notification={n} onClick={(item) => markAsRead(item.id)} />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
