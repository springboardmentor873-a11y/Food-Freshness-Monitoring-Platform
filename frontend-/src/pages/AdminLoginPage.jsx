import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, UserCheck, Leaf, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/shared/ThemeToggle";
import { appToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const [form, setForm] = useState({
    adminUsername: "",
    adminPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.adminUsername.trim()) {
      next.adminUsername = "Admin Username is required";
    }
    if (!form.adminPassword) {
      next.adminPassword = "Admin Password is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      adminLogin(form.adminUsername, form.adminPassword);
      setIsLoading(false);
      appToast.success(`Authenticated as Administrator (${form.adminUsername})`);
      navigate("/admin-dashboard", { replace: true });
    }, 600);
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* Background Mesh Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-70 dark:opacity-40" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/15" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-600/15" />

      {/* Header Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            <Leaf size={20} />
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            FreshAI
            <span className="block text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Admin Portal
            </span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Admin Form Container */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-md flex-col px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-glow">
            <ShieldCheck size={26} />
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Admin Login
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            System administration & platform telemetry access
          </p>
        </motion.div>

        {/* Glassmorphism Card */}
        <div className="surface-card glass-panel relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Admin Username"
              name="adminUsername"
              type="text"
              placeholder="e.g. admin_sys"
              value={form.adminUsername}
              onChange={handleChange}
              error={errors.adminUsername}
              leftIcon={<UserCheck size={18} />}
              required
            />

            <Input
              label="Admin Password"
              name="adminPassword"
              type="password"
              placeholder="••••••••"
              value={form.adminPassword}
              onChange={handleChange}
              error={errors.adminPassword}
              leftIcon={<Lock size={18} />}
              required
            />

            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Admin Login
              </Button>
            </div>

            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                &larr; Switch to Standard User Login
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 text-center text-xs text-slate-400">
        Food Freshness Monitoring Platform &copy; {new Date().getFullYear()} — Restricted Admin Access
      </footer>
    </div>
  );
}
