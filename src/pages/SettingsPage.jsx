import { useState } from 'react'
import toast from 'react-hot-toast'
import { Moon, Sun, Bell, Globe, Palette, Save } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import Button from '../components/common/Button.jsx'
import { useTheme } from '../hooks/useTheme.js'

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German']
const ACCENTS = [
  { id: 'emerald', color: 'bg-emerald-500' },
  { id: 'sky', color: 'bg-sky-500' },
  { id: 'violet', color: 'bg-violet-500' },
  { id: 'amber', color: 'bg-amber-500' },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-emerald-600' : 'bg-graphite-300 dark:bg-graphite-600'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notif, setNotif] = useState({ spoilage: true, expiry: true, storage: true, email: false })
  const [language, setLanguage] = useState('English')
  const [accent, setAccent] = useState('emerald')

  const handleSave = () => toast.success('Settings saved successfully.')

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Settings' }]} />
      <div>
        <h2 className="font-display text-2xl font-bold text-graphite-800 dark:text-white">Settings</h2>
        <p className="text-sm text-graphite-500 dark:text-graphite-400">Customize how FreshEye AI looks and notifies you.</p>
      </div>

      <ChartCard title="Appearance" subtitle="Choose between light and dark mode">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${theme === 'light' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-graphite-200 dark:border-graphite-700'}`}
          >
            <Sun className="h-5 w-5 text-amber-500" />
            <div className="text-left">
              <p className="text-sm font-semibold text-graphite-800 dark:text-white">Light Mode</p>
              <p className="text-xs text-graphite-400">Bright, clean interface</p>
            </div>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${theme === 'dark' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-graphite-200 dark:border-graphite-700'}`}
          >
            <Moon className="h-5 w-5 text-sky-500" />
            <div className="text-left">
              <p className="text-sm font-semibold text-graphite-800 dark:text-white">Dark Mode</p>
              <p className="text-xs text-graphite-400">Easy on the eyes at night</p>
            </div>
          </button>
        </div>

        <div className="mt-5">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-graphite-600 dark:text-graphite-300"><Palette className="h-4 w-4" /> Accent Color</p>
          <div className="flex gap-3">
            {ACCENTS.map(a => (
              <button
                key={a.id}
                onClick={() => setAccent(a.id)}
                className={`h-9 w-9 rounded-full ${a.color} ${accent === a.id ? 'ring-2 ring-offset-2 ring-graphite-400 dark:ring-offset-graphite-900' : ''}`}
              />
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Notifications" subtitle="Choose which alerts you want to receive">
        <div className="space-y-4">
          {[
            { key: 'spoilage', label: 'Spoilage Alerts', desc: 'Get notified the moment an item is flagged as spoiled.' },
            { key: 'expiry', label: 'Expiry Alerts', desc: 'Reminders before items reach their expiry date.' },
            { key: 'storage', label: 'Storage Alerts', desc: 'Temperature and humidity threshold breaches.' },
            { key: 'email', label: 'Email Notifications', desc: 'Also send a copy of alerts to your email.' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-graphite-800 dark:text-white">{item.label}</p>
                <p className="text-xs text-graphite-400">{item.desc}</p>
              </div>
              <Toggle checked={notif[item.key]} onChange={(v) => setNotif(prev => ({ ...prev, [item.key]: v }))} />
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Language & Region" subtitle="Set your preferred display language">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-graphite-400" />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field max-w-xs">
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </ChartCard>

      <div className="flex justify-end">
        <Button icon={Save} onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
