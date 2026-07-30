import { createContext, useContext, useMemo, useState } from "react";
import { NOTIFICATIONS } from "../mocks/notifications";

const NotificationsContext = createContext(undefined);

/**
 * NotificationsProvider — owns read/unread state so the Navbar bell badge,
 * the NotificationCenter dropdown, and the full Notifications page all stay
 * in sync without prop-drilling. Once FastAPI is live, swap the initial
 * state for notificationService.list() and mutations for the matching
 * mark-read endpoints.
 */
export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead }),
    [notifications, unreadCount]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}
