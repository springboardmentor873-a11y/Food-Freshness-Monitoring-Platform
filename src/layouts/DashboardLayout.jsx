import { useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/common/Sidebar.jsx'
import Navbar from '../components/common/Navbar.jsx'
import FAB from '../components/common/FAB.jsx'
import BackToTop from '../components/common/BackToTop.jsx'

const TITLES = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Food Inventory',
  '/image-analysis': 'Image Analysis',
  '/freshness-assessment': 'Freshness Assessment',
  '/shelf-life-prediction': 'Shelf-Life Prediction',
  '/storage-monitoring': 'Storage Monitoring',
  '/recommendations': 'Recommendations',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/about': 'About Project',
  '/profile': 'My Profile',
  '/user-management': 'User Management'
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const scrollRef = useRef(null)
  const title = TITLES[location.pathname] || 'FreshEye AI'

  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark bg-graphite-50 dark:bg-graphite-950">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setMobileOpen(true)} pageTitle={title} />
        <main ref={scrollRef} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <FAB />
      <BackToTop containerRef={scrollRef} />
    </div>
  )
}
