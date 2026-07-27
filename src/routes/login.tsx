import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/site/logo";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import heroProduce from "@/assets/hero-produce.jpg";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — FreshTrack" },
      { name: "description", content: "Log in to your FreshTrack account." },
      { property: "og:title", content: "FreshTrack — Log in" },
      { property: "og:description", content: "Log in to your FreshTrack account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  return (
    <section className="min-h-[calc(100vh-4rem)]">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_1fr]">
        <div className="flex items-center justify-center px-6 py-14 lg:px-12">
          <div className="w-full max-w-sm">
            <Logo />
            <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-ink-muted">Log in to your FreshTrack workspace.</p>

            <form onSubmit={(e) => { e.preventDefault(); toast.success("Logged in — redirecting…"); }} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink-muted">Email</label>
                <input type="email" required placeholder="you@company.com" className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-widest text-ink-muted">Password</label>
                  <a href="#" className="text-xs text-ink-muted hover:text-foreground">Forgot?</a>
                </div>
                <div className="relative">
                  <input type={show ? "text" : "password"} required placeholder="••••••••" className="w-full rounded-full border border-border bg-surface px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-3 grid place-items-center text-ink-muted">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:bg-primary-dark">
                Log in <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3 text-xs text-ink-muted">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-6 grid gap-2">
              <button className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:border-foreground/30">Continue with Google</button>
              <button className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:border-foreground/30">Continue with SSO</button>
            </div>

            <p className="mt-8 text-center text-sm text-ink-muted">
              New here? <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
        <div className="relative hidden overflow-hidden lg:block">
          <img src={heroProduce} alt="Fresh produce" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />
          <div className="absolute inset-x-10 bottom-10 max-w-md text-white">
            <div className="text-xs uppercase tracking-[0.2em] text-white/70">FreshTrack Platform</div>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">Every image, a decision. Every decision, a saving.</h2>
          </div>
        </div>
      </div>
    </section>
  );
}
