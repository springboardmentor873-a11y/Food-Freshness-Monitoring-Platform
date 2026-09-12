import { useState, useRef, useEffect } from "react";
import { useAuth, ROLES } from "../../context/AuthContext";
import { UserCheck, ChevronDown, Shield, Store, Warehouse, User, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appToast } from "../ui/Toast";

const ROLE_CONFIGS = [
  { id: ROLES.CONSUMER, label: "Consumer", icon: User, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
  { id: ROLES.RETAIL_MANAGER, label: "Retail Manager", icon: Store, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
  { id: ROLES.WAREHOUSE_OPERATOR, label: "Warehouse Operator", icon: Warehouse, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
  { id: ROLES.FOOD_INSPECTOR, label: "Food Quality Inspector", icon: UserCheck, color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10" },
  { id: ROLES.ADMINISTRATOR, label: "Administrator", icon: Shield, color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10" },
];

export default function RoleSwitcher() {
  const { role, switchRole } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const activeConfig = ROLE_CONFIGS.find((r) => r.id === role) || ROLE_CONFIGS[1];
  const Icon = activeConfig.icon;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRole = (newRole) => {
    switchRole(newRole);
    setOpen(false);
    appToast.success(`Switched role to ${newRole}`);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        title="Switch role view"
      >
        <span className={`flex h-5 w-5 items-center justify-center rounded-md ${activeConfig.color}`}>
          <Icon size={12} />
        </span>
        <span className="hidden md:inline">{activeConfig.label}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-2 px-2 py-1 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Active Role</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tailors dashboard, analytics & metrics</p>
            </div>

            <div className="space-y-1">
              {ROLE_CONFIGS.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = item.id === role;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectRole(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${item.color}`}>
                        <ItemIcon size={13} />
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isSelected && <Check size={14} className="text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
