import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "@/components/site/motion";
import {
  ArrowRight,
  Sparkles,
  ScanLine,
  ShieldCheck,
  Thermometer,
  Boxes,
  BarChart3,
  Leaf,
  Cpu,
  Clock,
  Bell,
  FileBarChart2,
  Users,
  CheckCircle2,
} from "lucide-react";
import heroProduce from "@/assets/hero-produce.jpg";
import aiScanApple from "@/assets/ai-scan-apple.jpg";
import coldStorage from "@/assets/cold-storage.jpg";
import farmerHands from "@/assets/farmer-hands.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshTrack — AI Food Freshness Monitoring Platform" },
      {
        name: "description",
        content:
          "Detect food freshness, predict shelf life, and eliminate waste with computer vision built for retailers and warehouses.",
      },
      { property: "og:title", content: "FreshTrack — AI Food Freshness Monitoring" },
      {
        property: "og:description",
        content:
          "Enterprise AI for food quality: freshness scoring, shelf-life prediction, storage recommendations, and inventory intelligence.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <Cta />
    </>
  );
}

/* ------------------------------- HERO ------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-24 lg:pt-16 lg:pb-32">
      {/* soft ambient background */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-24 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_10%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-[0.35]" />

      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* left */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-ink-muted shadow-elegant backdrop-blur"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-primary animate-pulse-ring" />
              Now with real-time shelf-life prediction v2
            </motion.div>

            <h1 className="mt-6 font-display text-[44px] leading-[1.02] font-semibold tracking-[-0.03em] sm:text-6xl lg:text-[68px]">
              Monitor food freshness
              <br />
              with <span className="text-gradient-brand">artificial intelligence</span>.
            </h1>

            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-muted">
              FreshTrack turns a single photo into a full quality report — food type, freshness score,
              spoilage probability, remaining shelf life, and precise storage recommendations. Built for retailers,
              warehouses, and food inspection teams who care about waste.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/analyze"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4" />
                Analyze food
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium hover:border-foreground/30"
              >
                View dashboard
              </Link>
            </div>

            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {[
                { n: "5K+", l: "Training images" },
                { n: "96%", l: "Prediction accuracy" },
                { n: "13", l: "Food categories" },
                { n: "Real-time", l: "Shelf-life" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{s.n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest text-ink-muted">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* right: composed visual */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      {/* main image */}
      <div className="relative overflow-hidden rounded-3xl ring-brand">
        <img
          src={heroProduce}
          alt="Fresh produce"
          width={1600}
          height={1200}
          className="aspect-[5/6] w-full object-cover"
        />
        {/* scan overlay */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-6 top-[36%] h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_2px_var(--primary)]" />
          <div className="absolute left-6 right-6 top-[36%] h-24 bg-gradient-to-b from-primary/25 to-transparent blur-md" />
        </div>

        {/* corner brackets */}
        {[
          "left-4 top-4 border-l-2 border-t-2",
          "right-4 top-4 border-r-2 border-t-2",
          "left-4 bottom-4 border-l-2 border-b-2",
          "right-4 bottom-4 border-r-2 border-b-2",
        ].map((cls) => (
          <span key={cls} className={`absolute h-6 w-6 rounded-[3px] border-primary/80 ${cls}`} />
        ))}
      </div>

    </div>
  );
}

/* ---------------------------- FEATURES ---------------------------- */

const features = [
  { icon: Cpu, title: "AI Food Detection", desc: "13-class computer vision model classifies produce, dairy, meats, and grains with 96% top-1 accuracy." },
  { icon: ScanLine, title: "Freshness Detection", desc: "Distinguishes fresh from rotten with pixel-level attention on discoloration and texture." },
  { icon: Clock, title: "Shelf-Life Prediction", desc: "Regression model predicts remaining shelf life in days based on visual and environmental context." },
  { icon: ShieldCheck, title: "Spoilage Alerts", desc: "Detects early spoilage signals and forwards them to the right team before losses happen." },
  { icon: Boxes, title: "Inventory Management", desc: "Track every batch by category, expiry, and status with a beautiful, filterable data grid." },
  { icon: Thermometer, title: "Storage Monitoring", desc: "Live temperature and humidity for every zone, tied back to the goods stored there." },
  { icon: Sparkles, title: "Recommendation Engine", desc: "Precise storage advice per item — temperature, humidity, packaging, and rotation cadence." },
  { icon: FileBarChart2, title: "Reports & Analytics", desc: "PDF and Excel reports on predictions, inventory health, and spoilage trends." },
  { icon: Bell, title: "Notifications", desc: "Freshness, shelf-life, and inventory alerts routed by role — no more email chaos." },
  { icon: Users, title: "Role-Based Access", desc: "Purpose-built dashboards for consumers, retailers, warehouses, inspectors, and admins." },
  { icon: BarChart3, title: "Freshness Analytics", desc: "Cohort analysis of freshness over time, by SKU, supplier, or storage zone." },
  { icon: Leaf, title: "Waste Reduction", desc: "Every prediction is a chance to sell earlier, discount smarter, and waste less." },
];

function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Platform"
          title="A complete stack for food quality"
          description="Twelve modules working as one. From the first photo to the final report — FreshTrack covers the entire food-quality workflow."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-lift"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 6) * 0.04 }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
              />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary-dark">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-[17px] font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- HOW IT WORKS --------------------------- */

const steps = [
  { n: "01", title: "Upload food image", desc: "Drag, drop, or capture from a warehouse camera. Any lighting, any angle." },
  { n: "02", title: "AI detects food name", desc: "The classifier resolves the item across 13 core food categories in milliseconds." },
  { n: "03", title: "Freshness detection", desc: "A specialised head distinguishes fresh from spoiling produce, factoring color, texture, and lesions." },
  { n: "04", title: "Confidence score", desc: "Every prediction carries calibrated confidence — never opaque, never a black box." },
  { n: "05", title: "Shelf-life prediction", desc: "Estimate remaining days based on visual signals combined with your environmental data." },
  { n: "06", title: "Storage recommendation", desc: "Temperature, humidity, packaging, and priority-of-sale — all tailored per item." },
  { n: "07", title: "Generate report", desc: "Export a PDF diagnostic report ready for suppliers, auditors, or compliance." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="From photo to insight in one flow"
          description="FreshTrack is a pipeline, not a black box. Every stage is inspectable, explainable, and traceable."
        />
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="relative">
            <img
              src={aiScanApple}
              alt="AI scanning apple"
              width={1200}
              height={1400}
              loading="lazy"
              className="aspect-[5/6] w-full rounded-3xl object-cover ring-brand"
            />
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-background/95 p-5 shadow-lift ring-1 ring-black/5 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span className="uppercase tracking-widest">Pipeline latency</span>
                <span className="font-semibold text-foreground">~180ms</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1">
                {["Detect", "Classify", "Score", "Report"].map((s, i) => (
                  <div key={s} className="text-center">
                    <div className={`h-1 rounded-full ${i < 3 ? "bg-primary" : "bg-accent"}`} />
                    <div className="mt-1.5 text-[10px] font-medium text-ink-muted">{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ol className="relative border-l border-dashed border-border pl-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                className="relative pb-8 last:pb-0"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <span className="absolute -left-[41px] top-0 grid h-8 w-8 place-items-center rounded-full border border-border bg-surface font-display text-[11px] font-semibold text-primary-dark shadow-elegant">
                  {s.n}
                </span>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-muted">{s.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}


/* ---------------------------- USE CASES ---------------------------- */

function UseCases() {
  const items = [
    {
      img: coldStorage,
      title: "Cold storage & warehousing",
      desc: "Correlate storage conditions with real freshness scores. Catch failing zones before goods spoil.",
    },
    {
      img: farmerHands,
      title: "Retail & grocery",
      desc: "Grade produce at intake, dynamic-price near-expiry inventory, and cut shrink by up to 34%.",
    },
  ];
  return (
    <section className="py-24 lg:py-32">
      <div className="container-page grid gap-6 md:grid-cols-2">
        {items.map((i) => (
          <motion.div
            key={i.title}
            className="group relative overflow-hidden rounded-3xl border border-border shadow-elegant"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img src={i.img} alt={i.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="font-display text-2xl font-semibold">{i.title}</h3>
              <p className="mt-1.5 max-w-md text-sm text-white/85">{i.desc}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                Read case study <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- CTA ------------------------------- */

function Cta() {
  return (
    <section className="pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[32px] bg-foreground p-10 text-background sm:p-16">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_100%_at_100%_0%,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_70%)]" />
          <div aria-hidden className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                <Leaf className="h-3.5 w-3.5 text-primary" /> Start reducing waste today
              </div>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Every image, a decision.
                <br />
                <span className="text-primary">Every decision, a saving.</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm text-white/75">
                Join the operators using FreshTrack to grade thousands of items a day, cut spoilage,
                and keep customers safe.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Create an account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white hover:bg-white/10">
                  Talk to sales
                </Link>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Deploy in under an hour, no infra required.",
                "SOC-ready RBAC across five roles.",
                "Export-ready PDF & Excel reports.",
                "Human-friendly explanations for every prediction.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                  <span className="text-white/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- SHARED HEADINGS ------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">{eyebrow}</div>
      )}
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[42px]">{title}</h2>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{description}</p>
      )}
    </div>
  );
}
