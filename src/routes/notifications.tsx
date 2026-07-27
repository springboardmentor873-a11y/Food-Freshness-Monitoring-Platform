import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — FreshTrack" },
      { name: "description", content: "Freshness, spoilage, shelf-life, and inventory alerts routed to the right people." },
      { property: "og:title", content: "FreshTrack Notifications" },
      { property: "og:description", content: "Real-time alerts routed to the right people." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Notifications"
        title="The right alert. The right person. The right time."
        description="Freshness, spoilage, and inventory alerts routed by role, with rich context and one-click actions."
      />
      <section className="pb-24">
        <div className="container-page max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-ink-muted">
            <Bell className="h-3.5 w-3.5 text-primary-dark" /> All channels
          </div>
          <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-24 text-center shadow-elegant">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary-dark">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">You're all caught up</h3>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              Freshness, spoilage, and inventory alerts will appear here as they come in.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
