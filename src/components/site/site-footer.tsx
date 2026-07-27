import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { Github, Linkedin, Twitter } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/how-it-works", label: "How it works" },
      { to: "/analyze", label: "AI Analysis" },
      { to: "/dashboard", label: "Dashboards" },
    ],
  },
  {
    title: "Platform",
    links: [
      { to: "/inventory", label: "Inventory" },
      { to: "/analytics", label: "Analytics" },
      { to: "/reports", label: "Reports" },
      { to: "/notifications", label: "Notifications" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr_1.4fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              AI-powered food freshness monitoring for retailers, warehouses, and supply chains committed to reducing waste.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-sm text-foreground/80 transition-colors hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
              Newsletter
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              Insights on food AI, shelf-life prediction, and supply chain sustainability.
            </p>
            <form className="mt-4 flex overflow-hidden rounded-full border border-border bg-surface p-1">
              <input
                type="email"
                placeholder="you@company.com"
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-ink-muted"
              />
              <button className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-primary-dark">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-ink-muted md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} FreshTrack Labs, Inc. Cultivating a fresher supply chain.</div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <a href="mailto:hello@FreshTrack.ai" className="hover:text-foreground">hello@FreshTrack.ai</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
