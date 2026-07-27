import { motion } from 'framer-motion'
import { ScanLine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FAB() {
  const navigate = useNavigate()
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => navigate('/image-analysis')}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-3.5 text-sm font-semibold text-white shadow-glow"
    >
      <ScanLine className="h-5 w-5" />
      Scan Food
    </motion.button>
  )
}
