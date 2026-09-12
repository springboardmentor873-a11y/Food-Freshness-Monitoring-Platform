import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { apiService } from "../services/api";

const NotificationsContext = createContext(undefined);

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const refreshNotifications = useCallback(async () => {
    const token = localStorage.getItem("ffm-auth-token");
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      const dbNotifs = await apiService.getNotifications();
      if (dbNotifs && Array.isArray(dbNotifs)) {
        const mapped = dbNotifs.map((n) => ({
          id: String(n.id),
          title: n.title,
          message: n.message,
          timestamp: new Date(n.created_at).toLocaleString(),
          type: n.type || "warning",
          isRead: n.is_read,
        }));
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.warn("[NotificationsProvider] Could not load notifications from backend:", err.message);
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const markAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    if (!isNaN(Number(id))) {
      try {
        await apiService.markNotificationRead(Number(id));
      } catch (err) {
        console.warn("[NotificationsProvider] Failed to mark read on backend:", err);
      }
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await apiService.markAllNotificationsRead();
    } catch (err) {
      console.warn("[NotificationsProvider] Failed to mark all read on backend:", err);
    }
  };

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications }),
    [notifications, unreadCount, refreshNotifications]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}


export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationsProvider");
  return ctx;
}
