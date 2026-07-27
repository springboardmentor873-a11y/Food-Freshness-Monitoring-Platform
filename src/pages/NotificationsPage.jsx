import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock, Thermometer, Info, CheckCheck } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import Badge from '../components/common/Badge.jsx'
import { useNotifications } from '../hooks/useNotifications.js'
import { timeAgo } from '../utils/helpers.js'

const ICONS = { spoilage: AlertTriangle, expiry: Clock, storage: Thermometer, info: Info }
const FILTERS = ['All', 'Spoilage Alerts', 'Expiry Alerts', 'Storage Alerts']
const TYPE_MAP = { 'Spoilage Alerts': 'spoilage', 'Expiry Alerts': 'expiry', 'Storage Alerts': 'storage' }

export default function NotificationsPage() {
  const { notifications, readIds, markAsRead, markAllAsRead, unreadCount } = useNotifications()
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? notifications : notifications.filter(n => n.type === TYPE_MAP[filter])

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Notifications' }]} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-graphite-800 dark:text-white">Notifications</h2>
          <p className="text-sm text-graphite-500 dark:text-graphite-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up — no unread notifications'}
          </p>
        </div>
        <button onClick={markAllAsRead} className="btn-secondary">
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'glass text-graphite-500 dark:text-graphite-300'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass-card divide-y divide-graphite-100 dark:divide-graphite-800">
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-graphite-400">No notifications in this category.</p>
        )}
        {filtered.map((n, i) => {
          const Icon = ICONS[n.type] || Info
          const isRead = readIds.has(n.id)
          return (
            <motion.button
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => markAsRead(n.id)}
              className={`flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-graphite-50 dark:hover:bg-graphite-800/50 ${isRead ? 'opacity-60' : ''}`}
            >
              <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.severity === 'critical' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/15' : n.severity === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/15' : 'bg-sky-100 text-sky-600 dark:bg-sky-500/15'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-graphite-800 dark:text-white">{n.title}</p>
                  {!isRead && <Badge color="emerald">New</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-graphite-500 dark:text-graphite-400">{n.message}</p>
                <p className="mt-1 text-xs text-graphite-400">{timeAgo(n.timestamp)}</p>
              </div>
              {!isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
