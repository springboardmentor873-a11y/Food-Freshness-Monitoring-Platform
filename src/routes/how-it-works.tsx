import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { motion } from "@/components/site/motion";
import aiScanApple from "@/assets/ai-scan-apple.jpg";
import { Upload, Cpu, Gauge, Clock, Thermometer, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — FreshTrack" },
      { name: "description", content: "See how FreshTrack turns a single photo into a full food-quality report in under 200ms." },
      { property: "og:title", content: "How FreshTrack works" },
      { property: "og:description", content: "From upload to report: detection, freshness scoring, shelf-life prediction, and storage recommendations." },
    ],
  }),
  component: HowPage,
});

const steps = [
  { icon: Upload, title: "Upload food image", desc: "Drag, drop, or capture from cameras across your facility." },
  { icon: Cpu, title: "AI detects food name", desc: "The classifier resolves the item across 13 core categories." },
  { icon: Gauge, title: "Freshness detection", desc: "Attention over color, texture, and lesion patterns." },
  { icon: CheckCircle2, title: "Confidence score", desc: "Calibrated confidence, never a black box." },
  { icon: Clock, title: "Shelf-life prediction", desc: "Days remaining, using visual + environmental context." },
  { icon: Thermometer, title: "Storage recommendation", desc: "Temperature, humidity, packaging, priority-of-sale." },
  { icon: FileText, title: "Generate report", desc: "PDF diagnostic reports ready for teams and auditors." },
];

function HowPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="From photo to insight in one flow."
        description="A transparent pipeline you can inspect, explain, and trust. No opaque models — just measurable stages producing measurable outcomes."
      />

      <section className="pb-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="sticky top-24">
            <div className="relative overflow-hidden rounded-3xl ring-brand">
              <img src={aiScanApple} alt="AI scanning" loading="lazy" className="aspect-[5/6] w-full object-cover" />
              <div aria-hidden className="pointer-events-none absolute inset-x-6 top-[40%] h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_2px_var(--primary)]" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { l: "Latency", v: "~180ms" },
                { l: "Accuracy", v: "96%" },
                { l: "Classes", v: "13" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-border bg-surface p-3 text-center">
                  <div className="text-[10px] uppercase tracking-widest text-ink-muted">{s.l}</div>
                  <div className="mt-1 font-display text-lg font-semibold">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <ol className="relative border-l border-dashed border-border pl-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                className="relative pb-10 last:pb-0"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="absolute -left-[41px] top-0 grid h-8 w-8 place-items-center rounded-full border border-border bg-surface font-display text-[11px] font-semibold text-primary-dark shadow-elegant">
                  0{i + 1}
                </span>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-elegant">
                  <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-primary/10 text-primary-dark">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.desc}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
