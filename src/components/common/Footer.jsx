import { Leaf, Github, Mail, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-graphite-200/60 bg-white/60 py-10 dark:border-graphite-800 dark:bg-graphite-900/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-graphite-800 dark:text-white">FreshEye AI</span>
            </div>
            <p className="mt-3 text-sm text-graphite-500 dark:text-graphite-400">
              AI-powered food quality assessment and shelf-life prediction for restaurants, warehouses and retailers.
            </p>
          </div>
          <div>
            <p className="section-label">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-graphite-500 dark:text-graphite-400">
              <li>Image Analysis</li>
              <li>Freshness Assessment</li>
              <li>Shelf-Life Prediction</li>
              <li>Storage Monitoring</li>
            </ul>
          </div>
          <div>
            <p className="section-label">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-graphite-500 dark:text-graphite-400">
              <li>About the Project</li>
              <li>Architecture</li>
              <li>Team &amp; Guide</li>
              <li>Version 1.0.0</li>
            </ul>
          </div>
          <div>
            <p className="section-label">Connect</p>
            <div className="mt-3 flex gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-graphite-100 text-graphite-500 dark:bg-graphite-800 dark:text-graphite-300"><Github className="h-4 w-4" /></span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-graphite-100 text-graphite-500 dark:bg-graphite-800 dark:text-graphite-300"><Mail className="h-4 w-4" /></span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-graphite-100 text-graphite-500 dark:bg-graphite-800 dark:text-graphite-300"><Linkedin className="h-4 w-4" /></span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-graphite-200/60 pt-6 text-center text-xs text-graphite-400 dark:border-graphite-800">
          © {new Date().getFullYear()} FreshEye AI — Food Freshness Monitoring Platform. Developed as part of an internship project at Infosys.
        </div>
      </div>
    </footer>
  )
}
