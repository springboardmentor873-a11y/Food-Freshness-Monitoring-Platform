import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  X,
  Camera,
  TrendingUp,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Boxes,
  Award,
  Flame,
} from "lucide-react";
import Button from "./Button";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState({
    images: 0,
    accuracy: 0,
    categories: 0,
    speed: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeen = localStorage.getItem("ffm_welcome_seen");
    if (!hasSeen) {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, []);

  // Count up animation when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const duration = 1200; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        images: Math.min(2500, Math.floor(2500 * progress)),
        accuracy: Math.min(94, Math.floor(94 * progress)),
        categories: Math.min(8, Math.floor(8 * progress)),
        speed: 2,
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem("ffm_welcome_seen", "true");
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleStartAnalysis = () => {
    handleClose();
    navigate("/login");
  };

  const handleExplorePlatform = () => {
    handleClose();
    navigate("/dashboard");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Dialog Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-[#0B1120]/95 dark:text-slate-100 max-h-[92vh] flex flex-col"
        >
          {/* Glowing Top Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-brand" />

          {/* Close Button (X) */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/80 text-slate-500 transition-transform duration-200 hover:rotate-90 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto p-6 sm:p-8 no-scrollbar space-y-6">
            {/* Top Brand Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Leaf size={16} className="text-emerald-500 animate-pulse" />
                <span>Infosys Springboard AI Project</span>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                AI Powered Food Freshness Monitoring Platform
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                "Intelligent Food Quality Analysis using Artificial Intelligence"
              </p>
            </div>

            {/* 3D AI Hero Scanning Illustration */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950 p-6 text-white shadow-inner dark:border-slate-800">
              {/* Floating Mesh Orbs */}
              <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-emerald-500/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-teal-500/20 blur-2xl" />

              <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                {/* SVG 3D Food & AI HUD Scanner */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex h-52 w-full items-center justify-center md:w-1/2"
                >
                  {/* Rotating Scanner Ring */}
                  <svg className="absolute h-48 w-48 animate-spin-slow opacity-40" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 6" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#14B8A6" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>

                  {/* Laser Beam Scanner Line */}
                  <motion.div
                    animate={{ top: ["10%", "85%", "10%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10B981]"
                  />

                  {/* Food Icons Graphic Grid */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl border border-emerald-500/30 bg-slate-900/80 p-3 shadow-md backdrop-blur-sm">
                      <span className="text-2xl">🍎</span>
                      <p className="mt-1 text-[10px] font-bold text-emerald-400">Fresh Apple</p>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">98.4% Fresh</span>
                    </div>

                    <div className="rounded-xl border border-teal-500/30 bg-slate-900/80 p-3 shadow-md backdrop-blur-sm">
                      <span className="text-2xl">🥦</span>
                      <p className="mt-1 text-[10px] font-bold text-teal-400">Broccoli</p>
                      <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-mono text-teal-300">Optimal Shelf</span>
                    </div>

                    <div className="rounded-xl border border-amber-500/30 bg-slate-900/80 p-3 shadow-md backdrop-blur-sm">
                      <span className="text-2xl">🍞</span>
                      <p className="mt-1 text-[10px] font-bold text-amber-400">Artisan Bread</p>
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-mono text-amber-300">3 Days Left</span>
                    </div>

                    <div className="rounded-xl border border-emerald-500/30 bg-slate-900/80 p-3 shadow-md backdrop-blur-sm">
                      <span className="text-2xl">🥛</span>
                      <p className="mt-1 text-[10px] font-bold text-emerald-400">Dairy Milk</p>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">Temp: 3°C Verified</span>
                    </div>
                  </div>
                </motion.div>

                {/* Hero Callout */}
                <div className="w-full text-center md:w-1/2 md:text-left">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-300">
                    <Sparkles size={12} /> AI Computer Vision Active
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold text-white sm:text-2xl leading-tight">
                    Welcome to the Future of Food Quality Monitoring
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 sm:text-sm leading-relaxed">
                    Experience intelligent food freshness detection powered by Artificial Intelligence & predictive analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Capabilities Grid */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Platform Capabilities
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {[
                  "Detect Fresh vs Spoiled Food",
                  "Predict Remaining Shelf Life",
                  "Get Smart Storage Recommendations",
                  "Monitor Inventory Efficiently",
                  "Reduce Food Waste",
                  "Improve Food Safety",
                  "Generate AI Reports",
                  "Visualize Food Analytics",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Feature Glass Cards */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Key Features
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: Camera,
                    title: "AI Food Scanner",
                    desc: "Upload food images for instant freshness analysis.",
                    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                  },
                  {
                    icon: TrendingUp,
                    title: "Shelf-Life Prediction",
                    desc: "Estimate remaining freshness using AI.",
                    color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
                  },
                  {
                    icon: Sparkles,
                    title: "Smart Storage Tips",
                    desc: "Receive personalized storage recommendations.",
                    color: "text-lime-600 dark:text-lime-400 bg-lime-500/10 border-lime-500/20",
                  },
                  {
                    icon: BarChart3,
                    title: "Analytics Dashboard",
                    desc: "Track freshness trends and inventory.",
                    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                  },
                ].map((card, idx) => {
                  const IconComp = card.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * idx }}
                      className="glass-panel flex items-start gap-3 rounded-2xl border border-slate-200/80 p-3.5 shadow-sm transition-all hover:border-emerald-500/40 dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${card.color}`}>
                        <IconComp size={18} />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {card.title}
                        </h4>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {card.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Live Statistics Counter Section */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-lg">🍎</span>
                <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                  {counts.images}+
                </p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Images Analyzed
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-lg">🤖</span>
                <p className="mt-1 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {counts.accuracy}%
                </p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  AI Accuracy
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-lg">📦</span>
                <p className="mt-1 text-xl font-extrabold text-teal-600 dark:text-teal-400">
                  {counts.categories}
                </p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Food Categories
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="text-lg">⚡</span>
                <p className="mt-1 text-xl font-extrabold text-amber-500">
                  &lt;{counts.speed}s
                </p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Scan Speed
                </p>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="text-center pt-1">
              <span className="inline-block rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-lime-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                "Analyze Smarter • Preserve Longer • Waste Less"
              </span>
            </div>
          </div>

          {/* Fixed Footer Buttons */}
          <div className="flex flex-col gap-2.5 border-t border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-[#0B1120] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                className="flex-1 sm:flex-none"
                onClick={handleStartAnalysis}
                rightIcon={<ArrowRight size={16} />}
              >
                🚀 Start Analysis
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="flex-1 sm:flex-none"
                onClick={handleExplorePlatform}
              >
                📊 Explore Platform
              </Button>
            </div>

            <button
              onClick={handleClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-center sm:text-right px-2 py-1"
            >
              Skip &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
