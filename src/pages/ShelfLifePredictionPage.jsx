import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CalendarClock, ScanLine, ArrowRight, Gauge, ShieldAlert } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import Button from '../components/common/Button.jsx'
import Badge from '../components/common/Badge.jsx'
import { loadAssessment } from '../utils/assessmentStore.js'
import { formatDate } from '../data/mockData.js'

const RISK_COLOR = { Low: 'emerald', Medium: 'amber', High: 'rose' }

export default function ShelfLifePredictionPage() {
  const [data, setData] = useState(null)
  useEffect(() => { setData(loadAssessment()) }, [])

  if (!data) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Shelf-Life Prediction' }]} />
        <div className="glass-card flex flex-col items-center justify-center gap-4 p-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CalendarClock className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-graphite-800 dark:text-white">No prediction available</h3>
          <p className="max-w-sm text-sm text-graphite-500 dark:text-graphite-400">Analyze a food image to generate a shelf-life prediction.</p>
          <Link to="/image-analysis"><Button icon={ScanLine}>Go to Image Analysis</Button></Link>
        </div>
      </div>
    )
  }

  const { shelfLife } = data
  const progress = Math.round((shelfLife.remainingDays / shelfLife.shelfDaysTotal) * 100)
  const today = new Date()
  const timeline = Array.from({ length: shelfLife.shelfDaysTotal + 1 }, (_, i) => i).filter((_, i, arr) => arr.length <= 10 || i % Math.ceil(arr.length / 10) === 0)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Shelf-Life Prediction' }]} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <p className="section-label">Food Item</p>
          <h3 className="mt-1 font-display text-lg font-bold text-graphite-800 dark:text-white">{shelfLife.food}</h3>
          <p className="text-xs text-graphite-400">{shelfLife.category}</p>
          <div className="mt-6 flex items-end gap-2">
            <span className="font-display text-4xl font-extrabold text-emerald-600">{shelfLife.remainingDays}</span>
            <span className="mb-1 text-sm text-graphite-400">day(s) remaining</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-graphite-100 dark:bg-graphite-800">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-emerald-600" />
          </div>
          <p className="mt-2 text-xs text-graphite-400">{progress}% of total shelf life remaining</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-emerald-600" />
            <p className="section-label">Risk Level</p>
          </div>
          <div className="mt-3"><Badge color={RISK_COLOR[shelfLife.riskLevel]} className="text-sm px-3 py-1.5">{shelfLife.riskLevel} Risk</Badge></div>
          <p className="mt-4 text-sm text-graphite-500 dark:text-graphite-400">
            Estimated expiry date: <span className="font-semibold text-graphite-800 dark:text-white">{shelfLife.estimatedExpiry}</span>
          </p>
          <p className="mt-1 text-xs text-graphite-400">Today: {formatDate(today)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-emerald-600" />
            <p className="section-label">Prediction Confidence</p>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-display text-3xl font-extrabold text-graphite-800 dark:text-white">{shelfLife.predictionConfidence}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-graphite-100 dark:bg-graphite-800">
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${shelfLife.predictionConfidence}%` }} />
          </div>
          <p className="mt-2 text-xs text-graphite-400">Derived from image clarity, model certainty and historical batch data.</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
        <h3 className="font-display text-sm font-bold text-graphite-800 dark:text-white">Shelf-Life Timeline</h3>
        <div className="mt-6 flex items-center justify-between overflow-x-auto pb-2">
          {timeline.map((day, i) => {
            const isPast = day <= (shelfLife.shelfDaysTotal - shelfLife.remainingDays)
            return (
              <div key={i} className="flex flex-col items-center gap-2 px-2">
                <div className={`h-3 w-3 rounded-full ${isPast ? 'bg-emerald-600' : 'bg-graphite-200 dark:bg-graphite-700'}`} />
                <span className="whitespace-nowrap text-[10px] text-graphite-400">Day {day}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="flex justify-end">
        <Link to="/recommendations">
          <Button icon={ArrowRight}>View Recommendations</Button>
        </Link>
      </div>
    </div>
  )
}
