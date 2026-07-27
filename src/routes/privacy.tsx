import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — FreshTrack" },
      { name: "description", content: "How FreshTrack handles your data." },
      { property: "og:title", content: "FreshTrack — Privacy" },
      { property: "og:description", content: "How FreshTrack handles your data." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Privacy" title="Your data, handled with care." description="This is a placeholder privacy policy. Replace with your legal team's copy prior to launch." />
      <section className="pb-24">
        <div className="container-page prose max-w-3xl text-sm leading-relaxed text-ink-muted">
          <p>FreshTrack collects only what's needed to operate the platform: account information, images you submit for analysis, and metadata about how the platform is used.</p>
          <p className="mt-4">We never sell your data. Images used for training are opt-in and can be deleted at any time.</p>
        </div>
      </section>
    </>
  ),
});
