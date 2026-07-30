import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Leaf, Upload, X, ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/shared/ThemeToggle";
import { appToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const INITIAL_STATE = {
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    profilePhoto: null,
  };

  const [form, setForm] = useState(INITIAL_STATE);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Profile photo handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        appToast.error("File size must be under 5MB");
        return;
      }
      setForm((prev) => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setForm((prev) => ({ ...prev, profilePhoto: null }));
    setPhotoPreview(null);
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

    // Full Name
    if (!form.fullName.trim()) {
      next.fullName = "Full Name is required";
    }

    // Username
    if (!form.username.trim()) {
      next.username = "Username is required";
    } else if (form.username.length < 3) {
      next.username = "Username must be at least 3 characters";
    }

    // Email
    if (!form.email.trim()) {
      next.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address";
    }

    // Mobile (10-digit validation)
    if (!form.mobile.trim()) {
      next.mobile = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ""))) {
      next.mobile = "Mobile Number must be exactly 10 digits";
    }

    // Password
    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    // Gender
    if (!form.gender) {
      next.gender = "Please select a gender";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) {
      appToast.error("Please resolve validation errors before submitting.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      register({
        name: form.fullName,
        username: form.username,
        email: form.email,
        mobile: form.mobile,
        gender: form.gender,
        profilePhoto: photoPreview,
      });
      setIsLoading(false);
      appToast.success("Registration successful! Welcome to FreshAI.");
      navigate("/dashboard", { replace: true });
    }, 700);
  };

  const handleClear = () => {
    setForm(INITIAL_STATE);
    setPhotoPreview(null);
    setErrors({});
    appToast.success("Form cleared");
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* Background Mesh Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-70 dark:opacity-40" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/15" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-600/15" />

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

      {/* Registration Container */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-2xl flex-col px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            <UserPlus size={24} />
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            User Registration
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Create your account to access AI freshness tracking & quality analytics
          </p>
        </motion.div>

        {/* Glassmorphism Form Card */}
        <div className="surface-card glass-panel relative rounded-3xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
          <form onSubmit={handleRegister} noValidate className="space-y-5">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {/* Full Name */}
              <Input
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
                leftIcon={<User size={18} />}
                required
              />

              {/* Username */}
              <Input
                label="Username"
                name="username"
                type="text"
                placeholder="e.g. aarav_sharma"
                value={form.username}
                onChange={handleChange}
                error={errors.username}
                leftIcon={<User size={18} />}
                required
              />

              {/* Email Address */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                leftIcon={<Mail size={18} />}
                required
              />

              {/* Mobile Number */}
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

              {/* Password */}
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
                {/* Strength Meter */}
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

              {/* Confirm Password */}
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

            {/* Gender Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Male", "Female", "Other"].map((g) => (
                  <label
                    key={g}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-sm font-medium transition-all ${
                      form.gender === g
                        ? "border-emerald-500 bg-emerald-50/70 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-1.5 text-xs font-medium text-rose-500">{errors.gender}</p>
              )}
            </div>

            {/* Profile Photo Upload (Optional) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Profile Photo <span className="text-xs font-normal text-slate-400">(Optional)</span>
              </label>
              {photoPreview ? (
                <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                      {form.profilePhoto?.name || "Profile Photo Uploaded"}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Ready for account
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                    title="Remove Photo"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-4 transition-colors hover:border-emerald-500/50 dark:border-slate-700 dark:hover:border-emerald-500/40">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Upload size={18} className="text-emerald-500" />
                    <span>Upload optional avatar image</span>
                  </div>
                  <span className="mt-0.5 text-xs text-slate-400">PNG, JPG or WEBP (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
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
                Register
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
                onClick={() => navigate("/login")}
                className="sm:w-36"
              >
                Back to Login
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            By registering, you agree to the Food Freshness Monitoring Platform terms of service.
          </p>
        </div>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 text-center text-xs text-slate-400">
        Food Freshness Monitoring System &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
