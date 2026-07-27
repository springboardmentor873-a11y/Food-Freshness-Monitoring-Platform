import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CheckCheck, AlertTriangle, Clock, Thermometer, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications.js'
import { timeAgo } from '../../utils/helpers.js'

const ICONS = { spoilage: AlertTriangle, expiry: Clock, storage: Thermometer, info: Info }

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { notifications, readIds, markAsRead, markAllAsRead, unreadCount } = useNotifications()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-graphite-500 hover:bg-graphite-100 dark:text-graphite-300 dark:hover:bg-graphite-800 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            className="glass-card absolute right-0 top-12 z-50 w-80 max-h-[26rem] overflow-y-auto p-3 sm:w-96"
          >
            <div className="flex items-center justify-between px-2 pb-2">
              <p className="font-display text-sm font-bold text-graphite-800 dark:text-white">Notifications</p>
              <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            </div>
            <div className="space-y-1">
              {notifications.slice(0, 8).map((n) => {
                const Icon = ICONS[n.type] || Info
                const isRead = readIds.has(n.id)
                return (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${isRead ? 'opacity-60' : 'bg-emerald-50/70 dark:bg-emerald-500/10'} hover:bg-graphite-100 dark:hover:bg-graphite-800/60`}
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.severity === 'critical' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/15' : n.severity === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/15' : 'bg-sky-100 text-sky-600 dark:bg-sky-500/15'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-graphite-800 dark:text-white">{n.title}</p>
                      <p className="truncate text-xs text-graphite-500 dark:text-graphite-400">{n.message}</p>
                      <p className="mt-0.5 text-[11px] text-graphite-400">{timeAgo(n.timestamp)}</p>
                    </div>
                    {!isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
                  </button>
                )
              })}
            </div>
            <Link to="/notifications" onClick={() => setOpen(false)} className="mt-2 block rounded-xl py-2 text-center text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
              View all notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
