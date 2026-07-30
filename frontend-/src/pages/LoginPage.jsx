import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Leaf, KeyRound, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/shared/ThemeToggle";
import { appToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [resetForm, setResetForm] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetErrors, setResetErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleResetChange = (e) => {
    setResetForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (resetErrors[e.target.name]) {
      setResetErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateSignIn = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateReset = () => {
    const next = {};
    if (!resetForm.newPassword) {
      next.newPassword = "New password is required";
    } else if (resetForm.newPassword.length < 6) {
      next.newPassword = "Password must be at least 6 characters";
    }
    if (!resetForm.confirmNewPassword) {
      next.confirmNewPassword = "Confirm new password is required";
    } else if (resetForm.newPassword !== resetForm.confirmNewPassword) {
      next.confirmNewPassword = "Passwords do not match";
    }
    setResetErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setIsLoading(true);
    setTimeout(() => {
      login(form.username, form.password);
      setIsLoading(false);
      appToast.success(`Welcome back, ${form.username}!`);
      navigate("/dashboard", { replace: true });
    }, 600);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!validateReset()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      appToast.success("Password reset successfully! Please sign in with your new password.");
      setIsForgotPassword(false);
      setForm((prev) => ({ ...prev, password: resetForm.newPassword }));
      setResetForm({ newPassword: "", confirmNewPassword: "" });
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
              Food Freshness Platform
            </span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Form Container */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-md flex-col px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            {isForgotPassword ? <KeyRound size={24} /> : <User size={24} />}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {isForgotPassword ? "Reset Your Password" : "User Sign In"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {isForgotPassword
              ? "Enter your new password details below"
              : "Access the Food Freshness Monitoring Platform"}
          </p>
        </motion.div>

        {/* Glassmorphism Card */}
        <div className="surface-card glass-panel relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
          <AnimatePresence mode="wait">
            {!isForgotPassword ? (
              /* ============= SIGN IN FORM ============= */
              <motion.form
                key="signin-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmitSignIn}
                noValidate
                className="space-y-4"
              >
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  error={errors.username}
                  leftIcon={<User size={18} />}
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

                  {/* Forgot Password Link */}
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Sign In
                </Button>

                <div className="mt-6 flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      Sign Up
                    </Link>
                  </p>
                  <Link
                    to="/admin-login"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mt-1"
                  >
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Admin Login Portal &rarr;
                  </Link>
                </div>
              </motion.form>
            ) : (
              /* ============= FORGOT / RESET PASSWORD EXPANSION ============= */
              <motion.form
                key="reset-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onSubmit={handleResetPassword}
                noValidate
                className="space-y-4"
              >
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-3.5 dark:border-emerald-500/10 dark:bg-emerald-500/5">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                    Enter your new password below to reset your credentials.
                  </p>
                </div>

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={resetForm.newPassword}
                  onChange={handleResetChange}
                  error={resetErrors.newPassword}
                  leftIcon={<Lock size={18} />}
                  required
                />

                <Input
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type="password"
                  placeholder="••••••••"
                  value={resetForm.confirmNewPassword}
                  onChange={handleResetChange}
                  error={resetErrors.confirmNewPassword}
                  leftIcon={<Lock size={18} />}
                  required
                />

                <div className="flex flex-col gap-2.5 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Reset Password
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetErrors({});
                    }}
                  >
                    Back to Sign In
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 text-center text-xs text-slate-400">
        Food Freshness Monitoring System &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
