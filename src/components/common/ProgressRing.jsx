import { motion } from 'framer-motion'

const COLOR_HEX = {
  emerald: '#18a06a',
  amber: '#d97706',
  rose: '#e11d48',
  sky: '#0284c7'
}

export default function ProgressRing({ value = 0, size = 120, strokeWidth = 10, color = 'emerald', label, sublabel }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const hex = COLOR_HEX[color] || COLOR_HEX.emerald

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-graphite-200 dark:text-graphite-700" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={hex} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold font-display text-graphite-800 dark:text-white">{value}%</span>
        {label && <span className="text-[11px] font-medium text-graphite-400">{label}</span>}
      </div>
      {sublabel && <span className="mt-2 text-xs text-graphite-400">{sublabel}</span>}
    </div>
  )
}
