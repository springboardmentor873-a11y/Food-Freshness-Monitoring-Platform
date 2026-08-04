import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getUnreadNotificationCount } from "../../services/notifications";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;
    getUnreadNotificationCount()
      .then((data) => active && setUnreadCount(data.unread_count))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const displayName = user?.name || "User";
  const displayRole = user?.role
    ? user.role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Consumer";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shadow-sm transition-colors duration-300">
      {/* Search Input */}
      <div className="relative w-72 lg:w-[400px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search inventory, reports, users..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Identity Card */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 cursor-pointer hover:border-blue-300 hover:bg-slate-100 transition"
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="h-9 w-9 rounded-xl object-cover border border-slate-300"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs uppercase shadow-sm">
              {displayName.slice(0, 2)}
            </div>
          )}

          <div className="hidden sm:block">
            <h4 className="text-xs font-bold text-slate-900 capitalize">
              {displayName}
            </h4>
            <p className="text-[10px] font-semibold text-slate-400">
              {displayRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;