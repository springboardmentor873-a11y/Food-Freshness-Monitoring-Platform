import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ScanLine, Leaf, AlertTriangle, Clock, Gauge, Thermometer, Boxes, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import DashboardCard from '../components/common/DashboardCard.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import Badge from '../components/common/Badge.jsx'
import { SkeletonCard } from '../components/common/SkeletonLoader.jsx'
import { useInventory } from '../hooks/useInventory.js'
import { useAuth } from '../hooks/useAuth.js'
import { useNotifications } from '../hooks/useNotifications.js'
import * as api from '../services/api'
import { statusColor, timeAgo } from '../utils/helpers.js'

const STATUS_COLORS = { Fresh: '#18a06a', Good: '#33ba81', Acceptable: '#d97706', 'Near Expiry': '#f59e0b', Spoiled: '#e11d48' }

export default function DashboardPage() {
  const { user } = useAuth()
  const { inventory, loading } = useInventory()
  const { notifications } = useNotifications()
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    if (inventory.length) {
      api.getAnalytics(inventory).then(setAnalytics)
    }
  }, [inventory])

  const fresh = inventory.filter(i => i.status === 'Fresh' || i.status === 'Good').length
  const spoiled = inventory.filter(i => i.status === 'Spoiled').length
  const nearExpiry = inventory.filter(i => i.status === 'Near Expiry').length
  const avgFreshness = inventory.length ? Math.round(inventory.reduce((s, i) => s + i.freshnessScore, 0) / inventory.length) : 0
  const upcomingExpiry = [...inventory].filter(i => i.daysLeft >= 0).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5)

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="section-label">Welcome back</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-graphite-800 dark:text-white">Hello, {user?.name?.split(' ')[0] || 'there'} 👋</h2>
          <p className="mt-1 text-sm text-graphite-500 dark:text-graphite-400">Here's what's happening across your food inventory today.</p>
        </div>
        <Link to="/image-analysis" className="btn-primary shrink-0">
          <ScanLine className="h-4 w-4" /> Scan New Item
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard icon={Boxes} label="Food Scanned" value={inventory.length} trend={8} trendLabel="vs last week" accent="sky" />
        <DashboardCard icon={Leaf} label="Fresh Foods" value={fresh} trend={4} trendLabel="vs last week" accent="emerald" />
        <DashboardCard icon={AlertTriangle} label="Spoiled Foods" value={spoiled} trend={-6} trendLabel="vs last week" accent="rose" />
        <DashboardCard icon={Clock} label="Near Expiry" value={nearExpiry} trend={-2} trendLabel="vs last week" accent="amber" />
        <DashboardCard icon={Gauge} label="Overall Freshness Score" value={avgFreshness} suffix="%" trend={3} trendLabel="platform average" accent="emerald" />
        <DashboardCard icon={Thermometer} label="Storage Health" value={94} suffix="%" trend={1} trendLabel="8 zones monitored" accent="sky" />
        <DashboardCard icon={Boxes} label="Inventory Health" value={Math.round((fresh / inventory.length) * 100)} suffix="%" trend={2} trendLabel="fresh + good ratio" accent="violet" />
        <DashboardCard icon={ScanLine} label="Weekly Scans" value={analytics?.weeklyScans?.reduce((s, d) => s + d.scans, 0) || 0} trend={12} trendLabel="last 7 days" accent="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard title="Fresh vs Spoiled" subtitle="Weekly scan outcomes" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics?.weeklyScans || []}>
              <defs>
                <linearGradient id="freshGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#18a06a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#18a06a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spoiledGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} />
              <Area type="monotone" dataKey="fresh" stroke="#18a06a" fill="url(#freshGrad)" strokeWidth={2.5} name="Fresh" />
              <Area type="monotone" dataKey="spoiled" stroke="#e11d48" fill="url(#spoiledGrad)" strokeWidth={2.5} name="Spoiled" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Freshness Status" subtitle="Current inventory split">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={analytics?.statusBreakdown || []} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {(analytics?.statusBreakdown || []).map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name] || '#a0a8b0'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard title="Shelf-Life Prediction Trend" subtitle="Avg. predicted shelf life (days)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics?.shelfLifeTrend?.slice(-10) || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Bar dataKey="avgShelfLife" fill="#18a06a" radius={[6, 6, 0, 0]} name="Avg Shelf Life (days)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Upcoming Expiry" subtitle="Next batches to expire">
          <div className="space-y-3">
            {upcomingExpiry.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-graphite-50/70 dark:bg-graphite-800/40 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-graphite-800 dark:text-white">{item.name}</p>
                  <p className="text-xs text-graphite-400">{item.storageLocation}</p>
                </div>
                <Badge color={statusColor(item.status)}>{item.daysLeft}d left</Badge>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Recent Activities"
          subtitle="Latest platform events"
          action={<Link to="/reports" className="flex items-center gap-1 text-xs font-semibold text-emerald-600">View reports <ArrowRight className="h-3 w-3" /></Link>}
        >
          <div className="space-y-3">
            {inventory.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl p-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ScanLine className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-graphite-700 dark:text-graphite-200">
                    <span className="font-semibold">{item.name}</span> scanned — batch {item.batchNumber}
                  </p>
                  <p className="text-xs text-graphite-400">{item.manufacturingDate}</p>
                </div>
                <Badge color={statusColor(item.status)}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Notifications Panel"
          subtitle="Freshness, spoilage & storage alerts"
          action={<Link to="/notifications" className="flex items-center gap-1 text-xs font-semibold text-emerald-600">View all <ArrowRight className="h-3 w-3" /></Link>}
        >
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-xl p-2">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.severity === 'critical' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/15' : n.severity === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/15' : 'bg-sky-100 text-sky-600 dark:bg-sky-500/15'}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-graphite-700 dark:text-graphite-200">{n.title}</p>
                  <p className="truncate text-xs text-graphite-400">{n.message}</p>
                </div>
                <span className="shrink-0 text-[11px] text-graphite-400">{timeAgo(n.timestamp)}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
