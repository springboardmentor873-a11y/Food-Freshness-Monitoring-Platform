import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User, Store, Warehouse, ClipboardCheck, ShieldCheck, LayoutDashboard,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboards — FreshTrack" },
      { name: "description", content: "Role-based dashboards for consumers, retailers, warehouses, food inspectors, and administrators." },
      { property: "og:title", content: "FreshTrack Dashboards" },
      { property: "og:description", content: "One platform, five points of view. Each role sees exactly what they need." },
    ],
  }),
  component: DashboardPage,
});

const roles = [
  { id: "consumer",   label: "Consumer",       icon: User,            copy: "Track your recent scans, freshness scores, and personalized storage tips." },
  { id: "retail",     label: "Retail Manager", icon: Store,           copy: "Monitor freshness index, at-risk SKUs, and waste prevention across your stores." },
  { id: "warehouse",  label: "Warehouse",      icon: Warehouse,       copy: "Watch zone temperature, humidity, and batch compliance in real time." },
  { id: "inspector",  label: "Inspector",      icon: ClipboardCheck,  copy: "Review batch analyses, pass rates, and spoilage flags awaiting inspection." },
  { id: "admin",      label: "Administrator",  icon: ShieldCheck,     copy: "Manage users, monitor platform health, and audit predictions across the org." },
] as const;
type RoleId = (typeof roles)[number]["id"];

function DashboardPage() {
  const [role, setRole] = useState<RoleId>("retail");
  const active = roles.find((r) => r.id === role)!;

  return (
    <section className="py-14 lg:py-20">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">Dashboards</div>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              One platform, five points of view.
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] text-ink-muted">
              Choose a role to preview the surface built for that team.
            </p>
          </div>
        </div>

        <div className="mt-8 inline-flex flex-wrap gap-1 rounded-full border border-border bg-surface p-1 shadow-elegant">
          {roles.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive ? "bg-foreground text-background" : "text-ink-muted hover:text-foreground"
                }`}
              >
                <r.icon className="h-4 w-4" />
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid place-items-center rounded-3xl border border-dashed border-border bg-surface px-6 py-24 text-center shadow-elegant">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary-dark">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <h3 className="mt-5 font-display text-lg font-semibold">{active.label} dashboard</h3>
          <p className="mt-2 max-w-md text-sm text-ink-muted">{active.copy}</p>
          <p className="mt-6 text-xs uppercase tracking-widest text-ink-muted">Metrics appear once your team starts scanning</p>
        </div>
      </div>
    </section>
  );
}
