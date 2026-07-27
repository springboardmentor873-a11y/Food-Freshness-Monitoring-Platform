import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function BackToTop({ containerRef }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef?.current || window
    const handler = () => {
      const scrollTop = containerRef?.current ? containerRef.current.scrollTop : window.scrollY
      setVisible(scrollTop > 400)
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [containerRef])

  const scrollUp = () => {
    if (containerRef?.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          onClick={scrollUp}
          className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-graphite-800/90 text-white shadow-glass-lg backdrop-blur hover:bg-graphite-900 dark:bg-white/90 dark:text-graphite-900"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
