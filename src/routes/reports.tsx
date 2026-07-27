import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { FileText, FileSpreadsheet, Calendar } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — FreshTrack" },
      { name: "description", content: "Generate PDF and Excel reports on predictions, inventory, and analytics." },
      { property: "og:title", content: "FreshTrack Reports" },
      { property: "og:description", content: "Generate PDF and Excel reports on predictions, inventory, and analytics." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reports"
        title="Export-ready insight, for everyone."
        description="Generate audit-quality PDF and Excel reports from any dashboard. Schedule them, share them, ship them."
      />
      <section className="pb-24">
        <div className="container-page">
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"><FileText className="h-4 w-4" /> Generate PDF</button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium hover:border-foreground/30"><FileSpreadsheet className="h-4 w-4" /> Generate Excel</button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium hover:border-foreground/30"><Calendar className="h-4 w-4" /> Schedule</button>
          </div>

          <div className="mt-8 grid place-items-center rounded-3xl border border-dashed border-border bg-surface px-6 py-24 text-center shadow-elegant">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary-dark">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">No reports yet</h3>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              Generated reports will appear here. Create your first one from the buttons above.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
