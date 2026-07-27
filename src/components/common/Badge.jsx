const COLOR_MAP = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  graphite: 'bg-graphite-100 text-graphite-700 dark:bg-graphite-700/40 dark:text-graphite-200'
}

export default function Badge({ children, color = 'graphite', dot = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${COLOR_MAP[color] || COLOR_MAP.graphite} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : color === 'rose' ? 'bg-rose-500' : 'bg-graphite-400'}`} />}
      {children}
    </span>
  )
}
