import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, Settings, LogOut, ChevronDown, UserCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { appToast } from "../ui/Toast";

/**
 * ProfileDropdown — avatar trigger + account menu. Closes on outside click
 * and on Escape.
 */
export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    appToast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${user.avatarColor || "bg-gradient-brand"}`}
        >
          {user.avatarInitials || "US"}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium leading-tight text-slate-700 dark:text-slate-200">
            {user.name}
          </span>
          <span className="block text-xs leading-tight text-emerald-600 dark:text-emerald-400 font-semibold">
            {user.role}
          </span>
        </span>
        <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Role: {user.role}
              </span>
            </div>

            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate("/app/settings");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <User size={16} /> My Profile
            </button>
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate("/app/settings");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Settings size={16} /> Settings
            </button>
            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            >
              <LogOut size={16} /> Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

