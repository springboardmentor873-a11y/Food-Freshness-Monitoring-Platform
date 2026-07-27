import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Leaf, Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mesh-light dark:bg-mesh-dark bg-graphite-50 px-6 text-center dark:bg-graphite-950">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-glow"
      >
        <Leaf className="h-8 w-8 text-white" />
      </motion.div>
      <h1 className="mt-8 font-display text-7xl font-extrabold text-graphite-800 dark:text-white">404</h1>
      <p className="mt-2 text-lg font-semibold text-graphite-600 dark:text-graphite-300">This batch went missing from the shelf.</p>
      <p className="mt-2 max-w-md text-sm text-graphite-500 dark:text-graphite-400">
        The page you're looking for doesn't exist or may have been moved. Let's get you back to somewhere fresh.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/dashboard" className="btn-primary">
          <Home className="h-4 w-4" /> Go to Dashboard
        </Link>
        <button onClick={() => window.history.back()} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    </div>
  )
}
