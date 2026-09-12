import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ChevronsLeft, X } from "lucide-react";
import { USER_NAV_GROUPS, ADMIN_NAV_GROUPS } from "../../mocks/navigation";
import { useNotifications } from "../../context/NotificationsProvider";
import { useAuth, ROLES } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { unreadCount } = useNotifications();
  const { user, role } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin-dashboard");
  const isAdminUser = role === ROLES.ADMINISTRATOR || (user && user.isAdmin);

  const activeNavGroups = (isAdminRoute || isAdminUser) ? ADMIN_NAV_GROUPS : USER_NAV_GROUPS;

  const content = (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className={cn("flex h-16 shrink-0 items-center gap-2.5 px-4", collapsed && "justify-center px-0")}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
          <Leaf size={18} />
        </span>
        {!collapsed && (
          <span className="text-sm font-bold leading-tight text-slate-900 dark:text-white">
            FreshAI
            <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {isAdminRoute ? "Admin Console" : "Freshness Platform"}
            </span>
          </span>
        )}
        <button
          onClick={onCloseMobile}
          className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 no-scrollbar">
        {activeNavGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.name + item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onCloseMobile}
                    title={collapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        collapsed && "justify-center px-0 py-2.5",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-brand" />
                        )}
                        <item.icon size={18} className="shrink-0" />
                        {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                        {!collapsed &&
                          (item.path === "/app/notifications" ? unreadCount > 0 : item.badge) && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                              {item.path === "/app/notifications" ? unreadCount : item.badge}
                            </span>
                          )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="hidden shrink-0 border-t border-slate-100 p-3 dark:border-slate-800 lg:block">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ChevronsLeft size={16} className={cn("transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-slate-100 bg-white transition-all duration-300 ease-premium dark:border-slate-800 dark:bg-slate-900 lg:block",
          collapsed ? "w-[76px]" : "w-[260px]"
        )}
      >
        {content}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-lg dark:bg-slate-900 lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
