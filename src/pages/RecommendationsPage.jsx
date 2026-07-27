import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ThermometerSnowflake, RefreshCcw, Clock, PackageSearch, AlertTriangle, Trash2, TrendingUp,
  ScanLine, Lightbulb
} from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import Button from '../components/common/Button.jsx'
import { loadAssessment } from '../utils/assessmentStore.js'
import { useInventory } from '../hooks/useInventory.js'

const ICONS = { ThermometerSnowflake, RefreshCcw, Clock, PackageSearch, AlertTriangle, Trash2, TrendingUp }

export default function RecommendationsPage() {
  const [data, setData] = useState(null)
  const { inventory } = useInventory()

  useEffect(() => {
    setData(loadAssessment())
  }, [])

  const nearExpiryItems = inventory.filter(i => i.status === 'Near Expiry' || i.status === 'Spoiled').slice(0, 5)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Recommendations' }]} />
      <div>
        <h2 className="font-display text-2xl font-bold text-graphite-800 dark:text-white">Recommendations</h2>
        <p className="text-sm text-graphite-500 dark:text-graphite-400">Actionable guidance generated from your latest freshness assessment and current inventory.</p>
      </div>

      {data ? (
        <ChartCard
          title={`Based on: ${data.assessment.identifiedFood}`}
          subtitle={`Analyzed ${new Date(data.analyzedAt).toLocaleString()}`}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.recommendations.map((rec, i) => {
              const Icon = ICONS[rec.icon] || Lightbulb
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 rounded-xl border border-graphite-100 p-4 dark:border-graphite-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-graphite-800 dark:text-white">{rec.title}</p>
                    <p className="mt-1 text-sm text-graphite-500 dark:text-graphite-400">{rec.detail}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </ChartCard>
      ) : (
        <ChartCard title="No recent assessment yet" subtitle="Run an image analysis to get personalized recommendations">
          <div className="flex flex-col items-center py-8 text-center">
            <ScanLine className="h-10 w-10 text-graphite-300" />
            <p className="mt-3 text-sm text-graphite-500 dark:text-graphite-400">Scan a food item to see tailored storage and consumption recommendations here.</p>
            <Link to="/image-analysis" className="mt-4">
              <Button>Scan Food Now</Button>
            </Link>
          </div>
        </ChartCard>
      )}

      <ChartCard title="Inventory-Wide Recommendations" subtitle="Batches that need action across your storage locations">
        <div className="space-y-3">
          {nearExpiryItems.length === 0 && <p className="text-sm text-graphite-400">No urgent inventory actions right now — nice work!</p>}
          {nearExpiryItems.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-graphite-100 p-3 dark:border-graphite-800">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${item.status === 'Spoiled' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {item.status === 'Spoiled' ? <Trash2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-graphite-800 dark:text-white">{item.name}</p>
                  <p className="text-xs text-graphite-400">{item.storageLocation} · Batch {item.batchNumber}</p>
                </div>
              </div>
              <p className="shrink-0 text-xs font-semibold text-graphite-500 dark:text-graphite-300">
                {item.status === 'Spoiled' ? 'Remove from shelf' : `Consume before ${item.expiryDate}`}
              </p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
