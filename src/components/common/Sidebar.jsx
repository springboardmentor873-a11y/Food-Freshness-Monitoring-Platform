import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Boxes, ScanLine, Sparkles, CalendarClock, Thermometer,
  Lightbulb, BarChart3, FileText, Bell, Settings, Info, Leaf, X, Users
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/image-analysis', label: 'Image Analysis', icon: ScanLine },
  { to: '/freshness-assessment', label: 'Freshness Assessment', icon: Sparkles },
  { to: '/shelf-life-prediction', label: 'Shelf-Life Prediction', icon: CalendarClock },
  { to: '/storage-monitoring', label: 'Storage Monitoring', icon: Thermometer },
  { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
]

const BOTTOM_ITEMS = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/about', label: 'About', icon: Info },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth()

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-glow">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-extrabold leading-none text-graphite-800 dark:text-white">FreshEye AI</p>
            <p className="text-[10px] font-medium text-graphite-400">Freshness Platform</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-graphite-400 hover:bg-graphite-100 dark:hover:bg-graphite-800 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-glow'
                  : 'text-graphite-500 hover:bg-graphite-100 dark:text-graphite-400 dark:hover:bg-graphite-800/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-graphite-400 group-hover:text-emerald-600'}`} />
                <span className="truncate">{label}</span>
                {isActive && (
                  <motion.span layoutId="sidebar-active" className="absolute inset-0 -z-10 rounded-xl bg-emerald-600" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />
                )}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'Administrator' && (
          <NavLink
            to="/user-management"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive ? 'bg-emerald-600 text-white shadow-glow' : 'text-graphite-500 hover:bg-graphite-100 dark:text-graphite-400 dark:hover:bg-graphite-800/70'
              }`
            }
          >
            <Users className="h-4 w-4 shrink-0" />
            <span>User Management</span>
          </NavLink>
        )}
      </nav>

      <div className="space-y-1 border-t border-graphite-200/60 dark:border-graphite-800 px-3 py-3">
        {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive ? 'bg-emerald-600 text-white' : 'text-graphite-500 hover:bg-graphite-100 dark:text-graphite-400 dark:hover:bg-graphite-800/70'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-graphite-200/60 bg-white/70 backdrop-blur-xl dark:border-graphite-800 dark:bg-graphite-900/60 lg:block">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-graphite-950/50" onClick={onClose} />
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-graphite-900 shadow-glass-lg"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  )
}
