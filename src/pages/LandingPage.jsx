import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Leaf, ScanLine, Thermometer, TrendingUp, ShieldCheck, ArrowRight,
  Sparkles, Boxes, CalendarClock, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import Footer from '../components/common/Footer.jsx'
import AnimatedCounter from '../components/common/AnimatedCounter.jsx'

const FEATURES = [
  { icon: ScanLine, title: 'Instant Image Analysis', desc: 'Upload or capture a photo and get an AI-driven freshness read in seconds — powered by EfficientNetB0.' },
  { icon: Sparkles, title: 'Freshness Assessment', desc: 'Color, texture and spoilage-probability analysis distilled into one clear freshness score.' },
  { icon: CalendarClock, title: 'Shelf-Life Prediction', desc: 'Know exactly how many days of shelf life remain, with a confidence-scored risk level.' },
  { icon: Thermometer, title: 'Storage Monitoring', desc: 'Track temperature, humidity, airflow and light exposure across every storage zone in real time.' },
  { icon: Boxes, title: 'Smart Inventory', desc: 'Batch-level inventory tracking with expiry alerts, so nothing slips past the loading dock.' },
  { icon: TrendingUp, title: 'Actionable Analytics', desc: 'Executive dashboards that turn spoilage trends into concrete waste-reduction decisions.' },
]

const STATS = [
  { value: 128400, label: 'Food Items Scanned', suffix: '+' },
  { value: 96, label: 'Model Accuracy', suffix: '%' },
  { value: 42, label: 'Warehouses Onboarded', suffix: '' },
  { value: 31, label: 'Waste Reduced', suffix: '%' },
]

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div>
      <nav className="sticky top-0 z-30 border-b border-graphite-200/60 bg-white/70 backdrop-blur-xl dark:border-graphite-800 dark:bg-graphite-950/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-glow">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-extrabold text-graphite-800 dark:text-white">FreshEye AI</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-graphite-500 hover:text-emerald-600 dark:text-graphite-300">Features</a>
            <a href="#modules" className="text-sm font-medium text-graphite-500 hover:text-emerald-600 dark:text-graphite-300">Modules</a>
            <a href="#stats" className="text-sm font-medium text-graphite-500 hover:text-emerald-600 dark:text-graphite-300">Impact</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="btn-ghost">Log In</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
          <button onClick={() => setNavOpen(o => !o)} className="rounded-lg p-2 text-graphite-500 md:hidden">
            {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {navOpen && (
          <div className="flex flex-col gap-2 border-t border-graphite-200/60 px-6 py-4 dark:border-graphite-800 md:hidden">
            <Link to="/login" className="btn-secondary w-full">Log In</Link>
            <Link to="/signup" className="btn-primary w-full">Get Started</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28">
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Quality Intelligence for Modern Food Supply Chains
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="font-display text-4xl font-extrabold tracking-tight text-graphite-800 dark:text-white sm:text-6xl"
          >
            Food Freshness Monitoring Platform
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-graphite-500 dark:text-graphite-300"
          >
            AI Powered Food Quality Assessment &amp; Shelf-Life Prediction for restaurants, warehouses, retailers and food-quality inspectors.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/signup" className="btn-primary px-7 py-3 text-base">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="btn-secondary px-7 py-3 text-base">Learn More</a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
          className="glass-card relative mx-auto mt-16 max-w-5xl overflow-hidden p-2"
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { label: 'Freshness Score', value: '92%', color: 'text-emerald-600', icon: Sparkles },
              { label: 'Shelf Life Remaining', value: '4.2 days', color: 'text-sky-600', icon: CalendarClock },
              { label: 'Storage Status', value: 'Optimal', color: 'text-emerald-600', icon: ShieldCheck },
            ].map((s, i) => (
              <div key={i} className="rounded-xl bg-white/70 p-6 text-center dark:bg-graphite-800/50">
                <s.icon className={`mx-auto mb-2 h-6 w-6 ${s.color}`} />
                <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs font-medium text-graphite-400">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Platform Capabilities</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-graphite-800 dark:text-white sm:text-4xl">Everything you need to fight food waste</h2>
          <p className="mt-3 text-graphite-500 dark:text-graphite-400">From the first photo to the final report, every module works together on one connected platform.</p>
        </div>
        <div id="modules" className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group p-6 hover:shadow-glass-lg transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-graphite-800 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-graphite-500 dark:text-graphite-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="bg-graphite-800 dark:bg-graphite-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={i}>
                <p className="font-display text-4xl font-extrabold text-emerald-400">
                  <AnimatedCounter value={s.value} />{s.suffix}
                </p>
                <p className="mt-2 text-sm text-graphite-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-graphite-800 dark:text-white sm:text-4xl">Ready to see it in action?</h2>
        <p className="mx-auto mt-3 max-w-xl text-graphite-500 dark:text-graphite-400">Create a free account and explore the full dashboard — inventory, AI scanning, analytics and reports, all in one place.</p>
        <Link to="/signup" className="btn-primary mt-8 inline-flex px-8 py-3.5 text-base">
          Create Free Account <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <Footer />
    </div>
  )
}
