import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "../../context/NotificationsProvider";
import NotificationCard from "../notifications/NotificationCard";
import EmptyState from "../ui/EmptyState";

/**
 * NotificationCenter — bell-triggered dropdown showing the 5 most recent
 * notifications, with a link through to the full Notifications page.
 */
export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const recent = notifications.slice(0, 5);

  const handleSelect = (notification) => {
    markAsRead(notification.id);
    setOpen(false);
    navigate("/app/notifications");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#0B1120]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto p-1.5">
              {recent.length === 0 ? (
                <EmptyState icon={Bell} title="You're all caught up" className="border-none py-10" />
              ) : (
                recent.map((n) => (
                  <NotificationCard key={n.id} notification={n} onClick={handleSelect} compact />
                ))
              )}
            </div>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/app/notifications");
              }}
              className="block w-full border-t border-slate-100 px-4 py-3 text-center text-sm font-medium text-emerald-600 hover:bg-slate-50 dark:border-slate-800 dark:text-emerald-400 dark:hover:bg-slate-800/60"
            >
              View all notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
