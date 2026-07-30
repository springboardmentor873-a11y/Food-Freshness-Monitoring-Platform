import toast, { Toaster } from "react-hot-toast";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

const ICONS = {
  success: <CheckCircle2 size={18} className="text-emerald-500" />,
  error: <XCircle size={18} className="text-rose-500" />,
  info: <Info size={18} className="text-teal-500" />,
  warning: <AlertTriangle size={18} className="text-amber-500" />,
};

function ToastCard({ t, variant, message }) {
  return (
    <div
      className={`${
        t.visible ? "animate-scale-in" : "opacity-0"
      } pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900`}
    >
      <span className="mt-0.5 shrink-0">{ICONS[variant]}</span>
      <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">{message}</p>
      <button
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss notification"
        className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <X size={15} />
      </button>
    </div>
  );
}

/**
 * appToast — call this from anywhere in the app instead of importing
 * react-hot-toast directly, so every toast in the product shares one visual style.
 */
export const appToast = {
  success: (message) => toast.custom((t) => <ToastCard t={t} variant="success" message={message} />),
  error: (message) => toast.custom((t) => <ToastCard t={t} variant="error" message={message} />),
  info: (message) => toast.custom((t) => <ToastCard t={t} variant="info" message={message} />),
  warning: (message) => toast.custom((t) => <ToastCard t={t} variant="warning" message={message} />),
};

/**
 * ToastProvider — mount once near the root of the app.
 */
export default function ToastProvider() {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          margin: 0,
        },
      }}
      containerStyle={{ top: 76 }}
      key={isDark ? "dark" : "light"}
    />
  );
}
