import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { motion } from "@/components/site/motion";
import {
  Cpu, ScanLine, ShieldCheck, Thermometer, Boxes, BarChart3, Leaf, Clock,
  Bell, FileBarChart2, Users, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — FreshTrack AI Food Freshness Platform" },
      { name: "description", content: "Twelve modules covering food AI detection, freshness scoring, shelf-life prediction, inventory, storage monitoring, analytics, and reports." },
      { property: "og:title", content: "FreshTrack Features" },
      { property: "og:description", content: "A complete food-quality stack: detection, freshness, shelf-life, inventory, storage, analytics." },
    ],
  }),
  component: FeaturesPage,
});

const groups = [
  {
    title: "Detection & prediction",
    items: [
      { icon: Cpu, title: "AI Food Detection", desc: "13-class classifier over produce, dairy, meats, and grains." },
      { icon: ScanLine, title: "Freshness Detection", desc: "Fresh vs. spoiling head with pixel-level attention." },
      { icon: Clock, title: "Shelf-Life Prediction", desc: "Days-remaining regression with confidence intervals." },
      { icon: ShieldCheck, title: "Spoilage Detection", desc: "Early spoilage signals routed to the right operator." },
    ],
  },
  {
    title: "Operations",
    items: [
      { icon: Boxes, title: "Inventory Management", desc: "Track every batch by category, expiry, and status." },
      { icon: Thermometer, title: "Storage Monitoring", desc: "Zone-level temperature and humidity, tied to SKUs." },
      { icon: Sparkles, title: "Recommendation Engine", desc: "Per-item storage advice: temp, humidity, packaging." },
      { icon: Bell, title: "Notifications", desc: "Freshness, shelf-life, and spoilage alerts by role." },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { icon: BarChart3, title: "Analytics", desc: "Cohort analysis of freshness over time, SKU, or supplier." },
      { icon: FileBarChart2, title: "Reports", desc: "PDF and Excel reports ready for audits and suppliers." },
      { icon: Users, title: "Role-Based Access", desc: "Five purpose-built dashboards, one platform." },
      { icon: Leaf, title: "Waste Reduction", desc: "Every prediction is a chance to save, discount, or donate." },
    ],
  },
];

function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title={<>Every module you need to <span className="text-gradient-brand">grade, monitor, and act</span> on food quality.</>}
        description="FreshTrack unifies twelve modules — from vision models to inventory tables — into a single, opinionated workflow."
      />
      <section className="pb-24">
        <div className="container-page space-y-16">
          {groups.map((g, gi) => (
            <div key={g.title}>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-semibold">{g.title}</h2>
                <div className="text-xs uppercase tracking-widest text-ink-muted">Group 0{gi + 1}</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {g.items.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="rounded-2xl border border-border bg-surface p-6 shadow-elegant transition-transform hover:-translate-y-0.5"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary-dark">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-[16px] font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
