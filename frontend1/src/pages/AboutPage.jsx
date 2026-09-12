import { Target, Users, Leaf } from "lucide-react";
import Card from "../components/ui/Card";

const VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "Cut food waste at every stage — from the fridge at home to the warehouse floor — using accessible AI freshness detection.",
  },
  {
    icon: Users,
    title: "Who We Serve",
    desc: "Consumers, retail managers, warehouse operators, food quality inspectors, and administrators, each with a tailored dashboard.",
  },
  {
    icon: Leaf,
    title: "Why It Matters",
    desc: "Roughly a third of all food produced globally is wasted. Better freshness visibility means fewer discards and lower cost.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          About the platform
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          AI Powered Food Freshness Monitoring Platform
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          Built as an Infosys Springboard capstone project, FreshAI combines computer
          vision, environmental sensor data, and predictive modeling to give an
          accurate, real-time picture of food freshness — reducing waste across the
          supply chain, from individual households to warehouse operations.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {VALUES.map((v) => (
          <Card key={v.title}>
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
              <v.icon size={20} />
            </span>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{v.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{v.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
