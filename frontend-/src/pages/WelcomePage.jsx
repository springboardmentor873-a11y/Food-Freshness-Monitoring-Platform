import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, UserPlus, ShieldCheck, Leaf, ArrowRight, Sparkles, Activity, Shield } from "lucide-react";
import ThemeToggle from "../components/shared/ThemeToggle";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const FLOW_OPTIONS = [
  {
    id: "user-signin",
    title: "User Sign In",
    path: "/login",
    icon: LogIn,
    badge: "Existing User",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description:
      "Log in to your consumer, retail, or warehouse account to inspect food quality, track inventory, and view AI analysis reports.",
    actionText: "Sign In as User",
    accentGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "user-signup",
    title: "User Sign Up",
    path: "/register",
    icon: UserPlus,
    badge: "New Account",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    description:
      "Create a new user profile to access instant computer-vision food scanning, freshness scoring, and expiration alerts.",
    actionText: "Create Account",
    accentGradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
  },
  {
    id: "admin-login",
    title: "Admin Login",
    path: "/admin-login",
    icon: ShieldCheck,
    badge: "Admin Access",
    badgeColor: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
    description:
      "Administrative portal for platform management, AI model performance telemetry, user role controls, and system oversight.",
    actionText: "Admin Portal",
    accentGradient: "from-slate-500/20 via-emerald-500/10 to-transparent",
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* Background Mesh Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-70 dark:opacity-40" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-600/15" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-600/15" />

      {/* Top Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
            <Leaf size={22} />
          </span>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              FreshAI
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Food Quality System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-6xl flex-col items-center px-4 py-8 text-center sm:px-6 lg:px-8">
        {/* Hero Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white/80 px-4 py-1.5 backdrop-blur-md dark:border-emerald-500/20 dark:bg-slate-900/80 shadow-xs"
        >
          <Sparkles size={16} className="text-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Next-Gen AI Computer Vision & Spoilage Prevention
          </span>
        </motion.div>

        {/* Project Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
        >
          <span className="block">AI Powered Food Freshness</span>
          <span className="mt-1 bg-gradient-brand bg-clip-text text-transparent">
            Monitoring Platform
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg"
        >
          Select an entry option below to get started with automated food quality assessment, real-time shelf life analytics, and supply chain management.
        </motion.p>

        {/* Three Large Glassmorphism Cards */}
        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {FLOW_OPTIONS.map((opt, idx) => {
            const IconComponent = opt.icon;
            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => navigate(opt.path)}
                className="group relative cursor-pointer text-left"
              >
                <div className="glass-panel relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 sm:p-8 shadow-md transition-all duration-300 hover:border-emerald-500/40 hover:shadow-glow dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-emerald-500/30">
                  {/* Subtle top accent gradient */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${opt.accentGradient}`}
                  />

                  <div>
                    {/* Header line inside card */}
                    <div className="flex items-center justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <IconComponent size={26} />
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide ${opt.badgeColor}`}
                      >
                        {opt.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h2 className="mt-6 text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                      {opt.title}
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {opt.description}
                    </p>
                  </div>

                  {/* Bottom Action Line */}
                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {opt.actionText}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-gradient-brand group-hover:text-white dark:bg-slate-800 dark:text-slate-300">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        AI Powered Food Freshness Monitoring Platform &copy; {new Date().getFullYear()} — Premium Quality Control & Spoilage Prevention
      </footer>
    </div>
  );
}
