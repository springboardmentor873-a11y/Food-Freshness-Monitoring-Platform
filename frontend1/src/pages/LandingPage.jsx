import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ScanLine,
  Gauge,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Apple,
  Fish,
  Milk,
  Wheat,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const FEATURES = [
  {
    icon: ScanLine,
    title: "Instant Image Analysis",
    desc: "Upload or scan any food item and get a freshness read in seconds — color, texture, and spoilage indicators, all detected automatically.",
  },
  {
    icon: Gauge,
    title: "Freshness Scoring Engine",
    desc: "A weighted score blending visual condition, storage conditions, shelf-life prediction, and product age into one clear number.",
  },
  {
    icon: Clock,
    title: "Shelf-Life Prediction",
    desc: "Know exactly how many days are left before spoilage — factoring in temperature, humidity, and packaging.",
  },
  {
    icon: ShieldCheck,
    title: "Storage Recommendations",
    desc: "AI-generated guidance on how to store each item longer, tuned to the product category.",
  },
  {
    icon: TrendingDown,
    title: "Waste Reduction Insights",
    desc: "Track freshness trends across your inventory and catch at-risk batches before they spoil.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    desc: "Ask questions about any item's freshness, storage, or shelf life and get instant, contextual answers.",
  },
];

const STEPS = [
  { step: "01", title: "Upload or Scan", desc: "Drag & drop a photo, or scan directly with your camera." },
  { step: "02", title: "AI Analysis", desc: "Our vision models assess color, texture, and spoilage indicators." },
  { step: "03", title: "Get Your Score", desc: "See a freshness score, shelf-life estimate, and confidence meter." },
  { step: "04", title: "Act on Insights", desc: "Follow storage tips or rotate inventory before it's too late." },
];

const STATS = [
  { value: "98.2%", label: "Freshness classification accuracy" },
  { value: "45%", label: "Average waste reduction reported" },
  { value: "12K+", label: "Food items analyzed in testing" },
  { value: "8", label: "Food categories supported" },
];

const FAQS = [
  {
    q: "What kinds of food can the platform analyze?",
    a: "Fruits, vegetables, dairy, meat & poultry, seafood, bakery products, packaged foods, and beverages — eight categories in total, each with tuned detection models.",
  },
  {
    q: "Do I need special hardware to use it?",
    a: "No. Any phone or webcam works for the camera scan, or you can upload existing photos. IoT temperature/humidity sensors are supported but optional.",
  },
  {
    q: "How accurate is the shelf-life prediction?",
    a: "Predictions combine image analysis with storage-condition data (temperature, humidity, packaging) for a confidence-scored estimate, not just a fixed date.",
  },
  {
    q: "Can retailers and warehouses use this at scale?",
    a: "Yes — role-based dashboards exist for consumers, retail managers, warehouse operators, food quality inspectors, and administrators.",
  },
];

const FLOATING_ICONS = [Apple, Fish, Milk, Wheat];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-mesh px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <Sparkles size={13} /> AI-Powered Food Freshness Monitoring
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Know exactly how fresh
            <span className="text-gradient-brand"> your food really is</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg"
          >
            Upload a photo, get an instant freshness score, shelf-life prediction, and
            AI storage recommendations — built for consumers, retailers, and supply
            chains that can't afford to guess.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Get Started Free
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="secondary">
                See How It Works
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Floating food illustrations */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {FLOATING_ICONS.map((Icon, i) => (
            <span
              key={i}
              className="absolute animate-float text-emerald-500/20 dark:text-emerald-400/10"
              style={{
                top: `${15 + i * 18}%`,
                left: i % 2 === 0 ? `${8 + i * 4}%` : undefined,
                right: i % 2 !== 0 ? `${8 + i * 4}%` : undefined,
                animationDelay: `${i * 0.6}s`,
              }}
            >
              <Icon size={i % 2 === 0 ? 56 : 40} />
            </span>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-slate-100 bg-white dark:border-slate-800 dark:bg-[#0B1120]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-gradient-brand sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to fight food waste
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            A complete AI toolkit — from a single photo to a full inventory strategy.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            >
              <Card hoverable className="h-full">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
                  <f.icon size={20} />
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50 py-20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">How it works</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Four steps between a photo and a decision.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <span className="text-3xl font-extrabold text-emerald-500/20">{s.step}</span>
                <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-10 divide-y divide-slate-100 dark:divide-slate-800">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-800 dark:text-slate-100">
                {f.q}
                <span className="ml-4 text-emerald-500 transition-transform group-open:rotate-45">
                  <ArrowRight size={16} className="rotate-[-45deg]" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-14 text-center shadow-lg sm:px-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Start reducing food waste today</h2>
          <p className="mx-auto mt-3 max-w-xl text-emerald-50">
            Create a free account and run your first freshness analysis in under a minute.
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg" variant="secondary" className="!bg-white !text-emerald-700 hover:!bg-emerald-50">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
