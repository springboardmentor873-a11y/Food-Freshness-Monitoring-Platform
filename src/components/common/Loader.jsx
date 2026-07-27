import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function Loader({ fullscreen = false, label = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-glow"
      >
        <Leaf className="h-7 w-7 text-white" />
      </motion.div>
      <p className="text-sm font-medium text-graphite-500 dark:text-graphite-300">{label}</p>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-mesh-light dark:bg-mesh-dark bg-graphite-50 dark:bg-graphite-950">
        {content}
      </div>
    )
  }
  return <div className="flex w-full items-center justify-center py-16">{content}</div>
}
