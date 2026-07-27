import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Droplets, Wind, Sun, Clock, MapPin } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import StatusIndicator from '../components/common/StatusIndicator.jsx'
import { SkeletonCard } from '../components/common/SkeletonLoader.jsx'
import { generateStorageConditions } from '../data/mockData.js'

export default function StorageMonitoringPage() {
  const [conditions, setConditions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setConditions(generateStorageConditions())
      setLoading(false)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  const healthy = conditions.filter(c => c.status === 'green').length

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Storage Monitoring' }]} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-graphite-800 dark:text-white">Storage Monitoring</h2>
          <p className="text-sm text-graphite-500 dark:text-graphite-400">Live environmental conditions across every storage zone.</p>
        </div>
        {!loading && (
          <div className="glass-card px-4 py-2 text-sm font-semibold text-emerald-600">
            {healthy}/{conditions.length} zones optimal
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : conditions.map((c, i) => (
            <motion.div
              key={c.location}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-graphite-400" />
                  <p className="font-display text-sm font-bold text-graphite-800 dark:text-white">{c.location}</p>
                </div>
                <StatusIndicator status={c.status} showLabel={false} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Metric icon={Thermometer} label="Temperature" value={`${c.temperature}°C`} accent={c.temperature < 0 ? 'sky' : c.temperature > 25 ? 'rose' : 'emerald'} />
                <Metric icon={Droplets} label="Humidity" value={`${c.humidity}%`} accent={c.humidity > 80 ? 'amber' : 'emerald'} />
                <Metric icon={Wind} label="Air Circulation" value={c.airCirculation} accent={c.airCirculation === 'Optimal' ? 'emerald' : c.airCirculation === 'Moderate' ? 'amber' : 'rose'} />
                <Metric icon={Sun} label="Light Exposure" value={c.lightExposure} accent={c.lightExposure === 'Low' ? 'emerald' : c.lightExposure === 'Moderate' ? 'amber' : 'rose'} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-graphite-100 pt-3 text-xs text-graphite-400 dark:border-graphite-800">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Monitored {c.durationHrs}h</span>
                <StatusIndicator status={c.status} />
              </div>
            </motion.div>
          ))}
      </div>

      <ChartCard title="Understanding Storage Status" subtitle="How zone status is calculated">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
            <StatusIndicator status="green" showLabel={false} />
            <p className="text-sm text-graphite-600 dark:text-graphite-300">All parameters within safe range for the stored category.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3 dark:bg-amber-500/10">
            <StatusIndicator status="yellow" showLabel={false} />
            <p className="text-sm text-graphite-600 dark:text-graphite-300">One or more readings drifting outside optimal thresholds.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-3 dark:bg-rose-500/10">
            <StatusIndicator status="red" showLabel={false} />
            <p className="text-sm text-graphite-600 dark:text-graphite-300">Immediate attention needed — spoilage risk is elevated.</p>
          </div>
        </div>
      </ChartCard>
    </div>
  )
}

function Metric({ icon: Icon, label, value, accent }) {
  const colors = {
    emerald: 'text-emerald-600 bg-emerald-500/10',
    amber: 'text-amber-600 bg-amber-500/10',
    rose: 'text-rose-600 bg-rose-500/10',
    sky: 'text-sky-600 bg-sky-500/10'
  }
  return (
    <div className="rounded-xl border border-graphite-100 p-2.5 dark:border-graphite-800">
      <div className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${colors[accent]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="text-sm font-bold text-graphite-800 dark:text-white">{value}</p>
      <p className="text-[11px] text-graphite-400">{label}</p>
    </div>
  )
}
