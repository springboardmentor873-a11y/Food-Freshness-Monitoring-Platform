import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, User, Mail, Phone, Lock, Leaf, ArrowRight, ShieldPlus } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/shared/ThemeToggle";
import { appToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function AdminRegisterPage() {
  const INITIAL_STATE = {
    fullName: "",
    adminUsername: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  };

  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { adminRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "bg-slate-200 dark:bg-slate-700" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 33, label: "Weak", color: "bg-rose-500", text: "text-rose-500" };
    if (score <= 4) return { score: 66, label: "Medium", color: "bg-amber-500", text: "text-amber-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
  };

  const pwdStrength = getPasswordStrength(form.password);

  const validate = () => {
    const next = {};

    if (!form.fullName.trim()) {
      next.fullName = "Full Name is required";
    }

    if (!form.adminUsername.trim()) {
      next.adminUsername = "Admin Username is required";
    } else if (form.adminUsername.length < 3) {
      next.adminUsername = "Admin Username must be at least 3 characters";
    }

    if (!form.email.trim()) {
      next.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address";
    }

    if (!form.mobile.trim()) {
      next.mobile = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ""))) {
      next.mobile = "Mobile Number must be exactly 10 digits";
    }

    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm password";
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegisterAdmin = (e) => {
    e.preventDefault();
    if (!validate()) {
      appToast.error("Please resolve validation errors before submitting.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      adminRegister({
        name: form.fullName,
        username: form.adminUsername,
        email: form.email,
        mobile: form.mobile,
      });
      setIsLoading(false);
      appToast.success("Admin registration successful! Logged in as Administrator.");
      navigate("/admin-dashboard", { replace: true });
    }, 700);
  };

  const handleClear = () => {
    setForm(INITIAL_STATE);
    setErrors({});
    appToast.success("Form cleared");
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* Background Mesh Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-70 dark:opacity-40" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/15" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-600/15" />

      {/* Header Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            <Leaf size={20} />
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            FreshAI
            <span className="block text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              Admin Registration
            </span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Registration Container */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-2xl flex-col px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-glow">
            <ShieldPlus size={26} />
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Admin Registration
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Create an administrator account with platform control privileges
          </p>
        </motion.div>

        {/* Form Card */}
        <div className="surface-card glass-panel relative rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
          <form onSubmit={handleRegisterAdmin} noValidate className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <Input
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="e.g. Dr. Rajesh Kumar"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
                leftIcon={<User size={18} />}
                required
              />

              <Input
                label="Admin Username"
                name="adminUsername"
                type="text"
                placeholder="e.g. admin_rajesh"
                value={form.adminUsername}
                onChange={handleChange}
                error={errors.adminUsername}
                leftIcon={<ShieldCheck size={18} />}
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="admin@freshai.dev"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={<Mail size={18} />}
                required
              />

              <Input
                label="Mobile Number (10 Digits)"
                name="mobile"
                type="tel"
                placeholder="9876543210"
                value={form.mobile}
                onChange={handleChange}
                error={errors.mobile}
                leftIcon={<Phone size={18} />}
                required
              />

              <div>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  leftIcon={<Lock size={18} />}
                  required
                />
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Strength:</span>
                      <span className={`font-semibold ${pwdStrength.text}`}>{pwdStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                        style={{ width: `${pwdStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                leftIcon={<Lock size={18} />}
                required
              />
            </div>

            {/* Buttons Row */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Register Admin
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleClear}
                className="sm:w-32"
              >
                Clear
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate("/admin-login")}
                className="sm:w-44"
              >
                Back to Admin Login
              </Button>
            </div>
          </form>
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 text-center text-xs text-slate-400">
        Food Freshness Monitoring Platform &copy; {new Date().getFullYear()} — Administrator Provisioning Portal
      </footer>
    </div>
  );
}
