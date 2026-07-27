import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/site/logo";
import { User, Store, Warehouse, ClipboardCheck, ShieldCheck, ArrowRight, Check } from "lucide-react";
import farmer from "@/assets/farmer-hands.jpg";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — FreshTrack" },
      { name: "description", content: "Create your FreshTrack workspace and choose a role." },
      { property: "og:title", content: "FreshTrack — Create account" },
      { property: "og:description", content: "Create your FreshTrack workspace and choose a role." },
    ],
  }),
  component: RegisterPage,
});

const roles = [
  { id: "consumer",  label: "Consumer",         desc: "Analyze food at home.",                icon: User },
  { id: "retail",    label: "Retail Manager",   desc: "Monitor stores and freshness KPIs.",   icon: Store },
  { id: "warehouse", label: "Warehouse Ops",    desc: "Track zones, temperature, humidity.",  icon: Warehouse },
  { id: "inspector", label: "Food Inspector",   desc: "Grade batches and audit quality.",     icon: ClipboardCheck },
  { id: "admin",     label: "Administrator",    desc: "Manage users and platform settings.",  icon: ShieldCheck },
] as const;

function RegisterPage() {
  const [role, setRole] = useState<string>("retail");
  return (
    <section className="min-h-[calc(100vh-4rem)]">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_1.05fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <img src={farmer} alt="Fresh greens" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-x-10 bottom-10 max-w-md text-white">
            <div className="text-xs uppercase tracking-[0.2em] text-white/70">Join FreshTrack</div>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">The freshest supply chains run on FreshTrack.</h2>
          </div>
        </div>
        <div className="flex items-center justify-center px-6 py-14 lg:px-12">
          <div className="w-full max-w-lg">
            <Logo />
            <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-ink-muted">Choose a role — we'll tailor the workspace to match.</p>

            <form onSubmit={(e) => { e.preventDefault(); toast.success("Account created — welcome to FreshTrack."); }} className="mt-8 space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name" placeholder="Jane Cooper" />
                <Field label="Work email" placeholder="jane@company.com" type="email" />
              </div>
              <Field label="Password" placeholder="Choose a strong password" type="password" />

              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-muted">Role</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {roles.map((r) => {
                    const active = role === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`group flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                          active ? "border-foreground/50 bg-primary/5 shadow-elegant" : "border-border bg-surface hover:border-foreground/20"
                        }`}
                      >
                        <div className={`grid h-9 w-9 flex-none place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-ink-muted"}`}>
                          <r.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-sm font-medium">{r.label} {active && <Check className="h-3.5 w-3.5 text-primary-dark" />}</div>
                          <div className="mt-0.5 text-xs text-ink-muted">{r.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:bg-primary-dark">
                Create account <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-sm text-ink-muted">
                Already registered? <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink-muted">{label}</label>
      <input {...rest} className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary" />
    </div>
  );
}
