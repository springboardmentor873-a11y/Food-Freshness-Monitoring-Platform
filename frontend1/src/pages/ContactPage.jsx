import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { appToast } from "../components/ui/Toast";

const CONTACT_DETAILS = [
  { icon: Mail, label: "Email", value: "support@freshai.dev" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, label: "Location", value: "Bengaluru, India" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForm({ name: "", email: "", message: "" });
      appToast.success("Message sent — we'll get back to you soon.");
    }, 800);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Get in touch</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Questions about the platform? Send us a message and we'll respond shortly.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {CONTACT_DETAILS.map((c) => (
            <Card key={c.label} padding="sm" className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <c.icon size={17} />
              </span>
              <div>
                <p className="text-xs text-slate-400">{c.label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{c.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              required
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="How can we help?"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
