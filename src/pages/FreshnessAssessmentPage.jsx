import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ScanLine, Palette, Layers, Percent, ArrowRight, Sparkles } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import Button from '../components/common/Button.jsx'
import Badge from '../components/common/Badge.jsx'
import ProgressRing from '../components/common/ProgressRing.jsx'
import { loadAssessment } from '../utils/assessmentStore.js'
import { statusColor } from '../utils/helpers.js'

const PREDICTION_LABELS = ['Fresh', 'Good', 'Acceptable', 'Near Spoilage', 'Spoiled']

export default function FreshnessAssessmentPage() {
  const [data, setData] = useState(null)

  useEffect(() => { setData(loadAssessment()) }, [])

  if (!data) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Freshness Assessment' }]} />
        <div className="glass-card flex flex-col items-center justify-center gap-4 p-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-graphite-800 dark:text-white">No assessment yet</h3>
          <p className="max-w-sm text-sm text-graphite-500 dark:text-graphite-400">Upload and analyze a food image first to see its freshness assessment here.</p>
          <Link to="/image-analysis"><Button icon={ScanLine}>Go to Image Analysis</Button></Link>
        </div>
      </div>
    )
  }

  const { assessment, imagePreview } = data
  const color = statusColor(assessment.prediction)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Freshness Assessment' }]} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden p-0 lg:col-span-1">
          {imagePreview && <img src={imagePreview} alt={assessment.identifiedFood} className="h-56 w-full object-cover" />}
          <div className="p-5">
            <p className="section-label">Identified Food</p>
            <h3 className="mt-1 font-display text-lg font-bold text-graphite-800 dark:text-white">{assessment.identifiedFood}</h3>
            <div className="mt-3"><Badge color={color} dot>{assessment.prediction}</Badge></div>
            <p className="mt-3 text-xs text-graphite-400">{assessment.modelUsed}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card flex flex-col items-center justify-center gap-4 p-6 sm:flex-row sm:justify-around lg:col-span-2">
          <ProgressRing value={assessment.freshnessScore} color={color} label="Freshness" />
          <ProgressRing value={assessment.confidence} color="sky" label="Confidence" />
          <ProgressRing value={assessment.overallQuality} color="emerald" label="Overall Quality" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-emerald-600" />
            <h3 className="font-display text-sm font-bold text-graphite-800 dark:text-white">Color Analysis</h3>
          </div>
          <dl className="mt-4 space-y-2.5 text-sm">
            <Row label="Hue Deviation" value={assessment.colorAnalysis.hueDeviation} />
            <Row label="Surface Discoloration" value={assessment.colorAnalysis.surfaceDiscoloration} />
          </dl>
          <p className="mt-3 rounded-lg bg-graphite-50 dark:bg-graphite-800/50 p-3 text-xs text-graphite-500 dark:text-graphite-400">{assessment.colorAnalysis.verdict}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-600" />
            <h3 className="font-display text-sm font-bold text-graphite-800 dark:text-white">Texture Analysis</h3>
          </div>
          <dl className="mt-4 space-y-2.5 text-sm">
            <Row label="Surface Smoothness" value={assessment.textureAnalysis.surfaceSmoothness} />
            <Row label="Firmness" value={assessment.textureAnalysis.firmness} />
            <Row label="Mold Detected" value={assessment.textureAnalysis.moldDetected ? 'Yes' : 'No'} />
          </dl>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-emerald-600" />
            <h3 className="font-display text-sm font-bold text-graphite-800 dark:text-white">Spoilage Probability</h3>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-graphite-100 dark:bg-graphite-800">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-rose-500" style={{ width: `${assessment.spoilageProbability}%` }} />
            </div>
            <span className="text-sm font-bold text-graphite-800 dark:text-white">{assessment.spoilageProbability}%</span>
          </div>
          <p className="mt-3 text-xs text-graphite-400">Based on visual degradation markers extracted from the image.</p>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <Link to="/shelf-life-prediction">
          <Button icon={ArrowRight}>View Shelf-Life Prediction</Button>
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-graphite-400">{label}</dt>
      <dd className="font-semibold text-graphite-700 dark:text-graphite-200">{value}</dd>
    </div>
  )
}
