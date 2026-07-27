import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { FileText, FileSpreadsheet, Printer, TrendingDown, DollarSign, ScanLine } from 'lucide-react'
import toast from 'react-hot-toast'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import Loader from '../components/common/Loader.jsx'
import Button from '../components/common/Button.jsx'
import { useInventory } from '../hooks/useInventory.js'
import * as api from '../services/api'
import { currency } from '../utils/helpers.js'

const REPORT_TYPES = [
  { id: 'freshness', label: 'Freshness Report', icon: ScanLine, desc: 'Freshness scores across all scanned items this month.' },
  { id: 'shelfLife', label: 'Shelf Life Report', icon: TrendingDown, desc: 'Remaining shelf life projections by category.' },
  { id: 'inventory', label: 'Inventory Report', icon: FileText, desc: 'Full batch-level inventory snapshot.' },
  { id: 'waste', label: 'Waste Report', icon: DollarSign, desc: 'Estimated waste value and spoilage cost trends.' },
]

export default function ReportsPage() {
  const { inventory, loading: invLoading } = useInventory()
  const [reports, setReports] = useState(null)
  const [activeReport, setActiveReport] = useState('freshness')

  useEffect(() => {
    api.getReports().then(setReports)
  }, [])

  const handleExport = (format) => {
    toast.success(`Exporting ${REPORT_TYPES.find(r => r.id === activeReport).label} as ${format}...`)
  }

  if (!reports || invLoading) return <Loader label="Preparing reports..." />

  const totalWaste = reports.monthly.reduce((s, m) => s + m.wasteValue, 0)
  const totalValue = reports.monthly.reduce((s, m) => s + m.inventoryValue, 0)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Reports' }]} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-graphite-800 dark:text-white">Reports</h2>
          <p className="text-sm text-graphite-500 dark:text-graphite-400">Generate and export detailed reports for stakeholders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={FileText} onClick={() => handleExport('PDF')}>PDF</Button>
          <Button variant="secondary" icon={FileSpreadsheet} onClick={() => handleExport('Excel')}>Excel</Button>
          <Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REPORT_TYPES.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className={`glass-card flex flex-col items-start gap-2 p-4 text-left transition-all ${activeReport === r.id ? 'ring-2 ring-emerald-500' : ''}`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <r.icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold text-graphite-800 dark:text-white">{r.label}</p>
            <p className="text-xs text-graphite-400">{r.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card p-5">
          <p className="text-xs font-medium text-graphite-400">Total Inventory Value (6mo)</p>
          <p className="mt-1 font-display text-2xl font-bold text-graphite-800 dark:text-white">{currency(totalValue)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs font-medium text-graphite-400">Total Waste Value (6mo)</p>
          <p className="mt-1 font-display text-2xl font-bold text-rose-600">{currency(totalWaste)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs font-medium text-graphite-400">Waste Ratio</p>
          <p className="mt-1 font-display text-2xl font-bold text-amber-600">{((totalWaste / totalValue) * 100).toFixed(1)}%</p>
        </div>
      </div>

      <ChartCard title="Monthly Inventory Value vs Waste" subtitle="Last 6 months">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reports.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaec" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={(v) => currency(v)} />
            <Legend />
            <Bar dataKey="inventoryValue" name="Inventory Value" fill="#18a06a" radius={[6, 6, 0, 0]} />
            <Bar dataKey="wasteValue" name="Waste Value" fill="#e11d48" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Scan Volume Trend" subtitle="Total scans logged per month">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={reports.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaec" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            <Line type="monotone" dataKey="scans" name="Scans" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={`Report Preview — ${REPORT_TYPES.find(r => r.id === activeReport).label}`} subtitle="Sample batch-level rows included in this export">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-graphite-100 text-xs uppercase text-graphite-400 dark:border-graphite-800">
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Batch</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {inventory.slice(0, 8).map(item => (
                <tr key={item.id} className="border-b border-graphite-50 dark:border-graphite-800/50">
                  <td className="px-3 py-2 font-medium text-graphite-700 dark:text-graphite-200">{item.name}</td>
                  <td className="px-3 py-2 text-graphite-500">{item.category}</td>
                  <td className="px-3 py-2 text-graphite-500">{item.batchNumber}</td>
                  <td className="px-3 py-2 text-graphite-500">{item.status}</td>
                  <td className="px-3 py-2 text-graphite-500">{item.expiryDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
