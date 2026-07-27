import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — FreshTrack" },
      { name: "description", content: "Prediction trends, food distribution, spoilage statistics, and shelf-life analytics." },
      { property: "og:title", content: "FreshTrack Analytics" },
      { property: "og:description", content: "Understand freshness across your entire operation with modern analytics." },
    ],
  }),
  component: AnalyticsPage,
});

const cards = [
  { title: "Freshness vs. spoilage", desc: "12-week trend of fresh and spoiling stock." },
  { title: "Food distribution", desc: "Category share across your inventory." },
  { title: "Predictions by day", desc: "Fresh vs. at-risk volume, day by day." },
  { title: "Shelf-life trend", desc: "Rolling average of predicted shelf life." },
];

function AnalyticsPage() {
  return (
    <>
      <PageHero
        eyebrow="Analytics"
        title={<>See freshness <span className="text-gradient-brand">the way operators actually think.</span></>}
        description="Prediction trends, category share, spoilage stats, and shelf-life cohorts — all in one place."
      />

      <section className="pb-24">
        <div className="container-page grid gap-5 sm:grid-cols-2">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-surface p-6 shadow-elegant">
              <h3 className="font-display text-base font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{c.desc}</p>
              <div className="mt-6 grid h-56 place-items-center rounded-xl border border-dashed border-border bg-background/60 text-center">
                <div>
                  <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary-dark">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">No data yet</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
