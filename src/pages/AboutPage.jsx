import { Target, Layers, Cpu, Rocket, Users, GitBranch } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import Badge from '../components/common/Badge.jsx'

const OBJECTIVES = [
  'Reduce food waste across the supply chain through early, AI-assisted spoilage detection.',
  'Give retailers and warehouses real-time visibility into freshness and storage conditions.',
  'Provide consumers a simple way to check the quality of food before they buy or cook it.',
  'Turn freshness and shelf-life data into actionable, exportable business reports.',
]

const ARCHITECTURE = [
  { title: 'Presentation Layer', detail: 'React 18 + Vite SPA, Tailwind CSS design system, Framer Motion for interaction.' },
  { title: 'Application Layer', detail: 'Context-driven state (Auth, Theme, Notifications) with a typed service layer (services/api.js).' },
  { title: 'Intelligence Layer (planned)', detail: 'EfficientNetB0 transfer-learning model served via a FastAPI inference endpoint for image-based freshness classification.' },
  { title: 'Data Layer (planned)', detail: 'Relational store for inventory batches, scans and audit trail, connected through the same service-layer contracts used today.' },
]

const STACK = [
  'React 18', 'Vite', 'Tailwind CSS', 'React Router DOM', 'Framer Motion',
  'Lucide React', 'Recharts', 'React Hook Form', 'React Hot Toast'
]

const FUTURE_SCOPE = [
  'Live camera-stream freshness scanning on warehouse conveyor lines.',
  'Integration with IoT temperature/humidity sensors for real storage telemetry.',
  'Multi-language voice alerts for floor staff.',
  'Predictive reordering suggestions based on spoilage trends.',
]

const TEAM = [
  { name: 'Team Lead & Frontend Engineer', role: 'UI/UX, React architecture, state management' },
  { name: 'ML Integration Lead', role: 'EfficientNetB0 model design & training pipeline' },
  { name: 'Backend Engineer', role: 'FastAPI services & database schema' },
  { name: 'QA & Documentation', role: 'Testing, presentation & report writing' },
]

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'About Project' }]} />
      <div className="glass-card p-6 text-center sm:p-10">
        <Badge color="emerald">Version 1.0.0</Badge>
        <h2 className="mt-4 font-display text-3xl font-bold text-graphite-800 dark:text-white">AI Food Freshness Monitoring Platform</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-graphite-500 dark:text-graphite-400">
          Developed as part of an internship project at Infosys, demonstrating how computer vision and modern web engineering can work together to reduce food waste across the supply chain.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Objectives" subtitle="What this platform sets out to solve">
          <ul className="space-y-3">
            {OBJECTIVES.map((o, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-graphite-600 dark:text-graphite-300">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {o}
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Architecture" subtitle="How the system is organized end-to-end">
          <div className="space-y-3">
            {ARCHITECTURE.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-graphite-100 p-3 dark:border-graphite-800">
                <Layers className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-graphite-800 dark:text-white">{a.title}</p>
                  <p className="mt-0.5 text-xs text-graphite-500 dark:text-graphite-400">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Technology Stack" subtitle="What powers this frontend">
          <div className="flex flex-wrap gap-2">
            {STACK.map(s => <Badge key={s} color="graphite">{s}</Badge>)}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Cpu className="h-4 w-4" /> Model: EfficientNetB0 (keras.applications, ImageNet transfer learning)
          </div>
        </ChartCard>

        <ChartCard title="Future Scope" subtitle="Where this project is headed next">
          <ul className="space-y-3">
            {FUTURE_SCOPE.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-graphite-600 dark:text-graphite-300">
                <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {f}
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <ChartCard title="Team Members" subtitle="Roles behind this internship project">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((t, i) => (
            <div key={i} className="rounded-xl border border-graphite-100 p-4 text-center dark:border-graphite-800">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="h-5 w-5" />
              </div>
              <p className="mt-2 text-sm font-semibold text-graphite-800 dark:text-white">{t.name}</p>
              <p className="mt-1 text-xs text-graphite-400">{t.role}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-graphite-100 pt-4 text-xs text-graphite-400 dark:border-graphite-800">
          <GitBranch className="h-3.5 w-3.5" /> Developed under the guidance of the Infosys mentoring team — Internship Program 2025–26
        </div>
      </ChartCard>
    </div>
  )
}
