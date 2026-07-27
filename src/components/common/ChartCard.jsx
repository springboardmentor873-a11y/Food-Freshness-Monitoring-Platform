import { motion } from 'framer-motion'

export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-5 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-base font-bold text-graphite-800 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-graphite-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}
