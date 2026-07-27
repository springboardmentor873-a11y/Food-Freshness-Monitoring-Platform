import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { Leaf, Cpu, ShieldCheck, Sprout, Target, Eye } from "lucide-react";
import farmerHands from "@/assets/farmer-hands.jpg";
import coldStorage from "@/assets/cold-storage.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — FreshTrack" },
      { name: "description", content: "FreshTrack builds AI for food quality, cutting waste and keeping people safe across the supply chain." },
      { property: "og:title", content: "About FreshTrack" },
      { property: "og:description", content: "AI for food quality. A more sustainable supply chain, one prediction at a time." },
      { property: "og:image", content: "" },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, t: "Mission", d: "Make food quality legible, so nothing that's still good gets thrown away." },
  { icon: Eye,    t: "Vision",  d: "A supply chain where every item has a live freshness score, from farm to fork." },
  { icon: Cpu,    t: "AI technology", d: "Computer vision trained on 5K+ labeled images across 13 categories." },
  { icon: Leaf,   t: "Food waste reduction", d: "Every prediction is an opportunity to save, discount, or donate." },
  { icon: Sprout, t: "Sustainability", d: "Reduce emissions by keeping edible food out of landfills." },
  { icon: ShieldCheck, t: "Trust & safety", d: "Explainable predictions with calibrated confidence and audit trails." },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={<>Building AI for food, <span className="text-gradient-brand">so less of it is wasted.</span></>}
        description="FreshTrack is a small team of engineers, agronomists, and designers on a mission to make food quality legible."
      />
      <section className="pb-16">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <img src={farmerHands} alt="Fresh greens" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant" />
          <img src={coldStorage} alt="Cold storage" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant" />
        </div>
      </section>
      <section className="pb-24">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="rounded-2xl border border-border bg-surface p-6 shadow-elegant">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary-dark"><v.icon className="h-5 w-5" /></div>
              <h3 className="mt-5 font-display text-lg font-semibold">{v.t}</h3>
              <p className="mt-2 text-sm text-ink-muted">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
