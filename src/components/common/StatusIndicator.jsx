const MAP = {
  green: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/30', label: 'Optimal' },
  yellow: { dot: 'bg-amber-500', ring: 'ring-amber-500/30', label: 'Caution' },
  red: { dot: 'bg-rose-500', ring: 'ring-rose-500/30', label: 'Critical' }
}

export default function StatusIndicator({ status = 'green', showLabel = true }) {
  const cfg = MAP[status] || MAP.green
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`relative flex h-2.5 w-2.5 rounded-full ${cfg.dot}`}>
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.dot} opacity-60`} />
      </span>
      {showLabel && <span className="text-xs font-medium text-graphite-500 dark:text-graphite-300">{cfg.label}</span>}
    </span>
  )
}
