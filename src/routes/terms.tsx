import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — FreshTrack" },
      { name: "description", content: "Terms of service for the FreshTrack platform." },
      { property: "og:title", content: "FreshTrack — Terms" },
      { property: "og:description", content: "Terms of service for the FreshTrack platform." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Terms" title="Straightforward terms." description="This is a placeholder terms of service." />
      <section className="pb-24">
        <div className="container-page max-w-3xl text-sm leading-relaxed text-ink-muted">
          <p>By using FreshTrack, you agree to use the service in good faith, avoid abuse, and respect the confidentiality of shared data.</p>
        </div>
      </section>
    </>
  ),
});
