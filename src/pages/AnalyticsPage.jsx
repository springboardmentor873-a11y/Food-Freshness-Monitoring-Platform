import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import Loader from '../components/common/Loader.jsx'
import { useInventory } from '../hooks/useInventory.js'
import * as api from '../services/api'

const PIE_COLORS = ['#18a06a', '#33ba81', '#0f8557', '#d97706', '#e11d48', '#0284c7', '#8b5cf6', '#f472b6']

export default function AnalyticsPage() {
  const { inventory, loading: invLoading } = useInventory()
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    if (!invLoading && inventory.length) {
      api.getAnalytics(inventory).then(setAnalytics)
    }
  }, [invLoading, inventory])

  if (invLoading || !analytics) return <Loader label="Crunching analytics..." />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Analytics' }]} />
      <div>
        <h2 className="font-display text-2xl font-bold text-graphite-800 dark:text-white">Executive Analytics</h2>
        <p className="text-sm text-graphite-500 dark:text-graphite-400">Deep insight into freshness trends, spoilage patterns and storage compliance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Food Categories" subtitle="Distribution of scanned items by category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={analytics.categoryBreakdown} dataKey="value" nameKey="name" outerRadius={100} label>
                {analytics.categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Freshness Trend" subtitle="Average shelf life remaining (last 14 days)">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.shelfLifeTrend}>
              <defs>
                <linearGradient id="freshGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18a06a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#18a06a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eaec" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Area type="monotone" dataKey="avgShelfLife" name="Avg. Shelf Life (days)" stroke="#18a06a" fill="url(#freshGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory Health by Status" subtitle="Current freshness classification">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.statusBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eaec" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {analytics.statusBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.name === 'Spoiled' ? '#e11d48' : entry.name === 'Near Expiry' ? '#d97706' : '#18a06a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Scan Volume" subtitle="Scans performed across all locations">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.weeklyScans}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eaec" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="scans" name="Total Scans" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Storage Compliance" subtitle="Percentage of readings within safe thresholds per zone">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.storageConditions.map(c => ({ location: c.location, compliance: c.status === 'green' ? 96 : c.status === 'yellow' ? 74 : 42 }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaec" vertical={false} />
            <XAxis dataKey="location" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            <Bar dataKey="compliance" name="Compliance %" fill="#18a06a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
