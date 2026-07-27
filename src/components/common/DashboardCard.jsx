import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter.jsx'

const ACCENTS = {
  emerald: { glow: 'bg-emerald-400/10', icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  sky: { glow: 'bg-sky-400/10', icon: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  amber: { glow: 'bg-amber-400/10', icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  rose: { glow: 'bg-rose-400/10', icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  violet: { glow: 'bg-violet-400/10', icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' }
}

export default function DashboardCard({ icon: Icon, label, value, suffix = '', trend, trendLabel, accent = 'emerald' }) {
  const isUp = trend >= 0
  const theme = ACCENTS[accent] || ACCENTS.emerald
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card group relative overflow-hidden p-5"
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-transform group-hover:scale-125 ${theme.glow}`} />
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${isUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'}`}>
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold font-display text-graphite-800 dark:text-white">
          <AnimatedCounter value={value} />{suffix}
        </p>
        <p className="mt-1 text-sm text-graphite-500 dark:text-graphite-400">{label}</p>
        {trendLabel && <p className="mt-0.5 text-xs text-graphite-400 dark:text-graphite-500">{trendLabel}</p>}
      </div>
    </motion.div>
  )
}
