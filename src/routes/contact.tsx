import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/page-hero";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — FreshTrack" },
      { name: "description", content: "Talk to our team about AI food freshness monitoring, dashboards, and integrations." },
      { property: "og:title", content: "Contact FreshTrack" },
      { property: "og:description", content: "Talk to our team about AI food freshness monitoring." },
    ],
  }),
  component: ContactPage,
});

const faq = [
  { q: "Which food categories does the model support?", a: "13 out of the box: produce, dairy, meats, grains, and bakery. Custom classes can be added." },
  { q: "How accurate is the freshness prediction?",     a: "Top-1 accuracy of 96% on our internal benchmark; calibrated confidence per prediction." },
  { q: "Can I deploy on-premise?",                       a: "Yes. We support cloud, hybrid, and fully on-prem deployments with signed model bundles." },
  { q: "Do you offer an API?",                           a: "Yes. REST endpoints, batch processing, and streaming ingest via camera feeds." },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you."
        description="Sales, partnerships, or a question about the platform — reach out and we'll respond within one business day."
      />
      <section className="pb-24">
        <div className="container-page grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-border bg-surface p-8 shadow-elegant">
            <ContactForm />
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-elegant">
              <h3 className="font-display text-lg font-semibold">Get in touch</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary-dark" /> 501 Market Street, Suite 700, San Francisco CA 94105</li>
                <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-primary-dark" /> +1 (415) 555-0134</li>
                <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-primary-dark" /> hello@FreshTrack.ai</li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-elegant">
              <div className="relative h-56 w-full bg-[radial-gradient(80%_60%_at_50%_50%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)]">
                <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-widest text-ink-muted">FreshTrack HQ</div>
                    <div className="text-sm font-medium">San Francisco, CA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-page mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold">Frequently asked</h2>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface shadow-elegant">
            {faq.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll be in touch shortly."); }}
      className="grid gap-4"
    >
      <h2 className="font-display text-2xl font-semibold">Send a message</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" placeholder="Jane Cooper" />
        <Field label="Work email" placeholder="jane@company.com" type="email" />
      </div>
      <Field label="Company" placeholder="Acme Foods" />
      <Field label="Role" placeholder="Retail Operations" />
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink-muted">Message</label>
        <textarea rows={5} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Tell us about your workflow…" />
      </div>
      <button className="mt-2 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:bg-primary-dark">Send message</button>
    </form>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink-muted">{label}</label>
      <input {...rest} className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="flex w-full items-start gap-4 p-5 text-left hover:bg-muted/40">
      <div className="flex-1">
        <div className="font-medium">{q}</div>
        {open && <div className="mt-2 text-sm text-ink-muted">{a}</div>}
      </div>
      <ChevronDown className={`mt-1 h-4 w-4 flex-none text-ink-muted transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}
