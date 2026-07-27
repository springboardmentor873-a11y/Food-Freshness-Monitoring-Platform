import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, User, Calendar, ShieldCheck, Save, Camera } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, email: user?.email } })

  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const onSubmit = (data) => {
    updateProfile(data)
    toast.success('Profile updated successfully.')
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'My Profile' }]} />

      <div className="glass-card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-emerald-500 to-emerald-700" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-700 text-2xl font-bold text-white shadow-glass-lg dark:border-graphite-900">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-graphite-500 shadow-md dark:bg-graphite-800">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 text-center sm:pb-2 sm:text-left">
              <h2 className="font-display text-xl font-bold text-graphite-800 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-graphite-400">{user?.email}</p>
            </div>
            <div className="sm:pb-2">
              <Badge color="emerald">{user?.role}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Account Details" className="lg:col-span-2">
          {!editing ? (
            <div className="space-y-4">
              <Detail icon={User} label="Full Name" value={user?.name} />
              <Detail icon={Mail} label="Email Address" value={user?.email} />
              <Detail icon={ShieldCheck} label="Role" value={user?.role} />
              <Detail icon={Calendar} label="Member Since" value={new Date(user?.joinedAt).toLocaleDateString()} />
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Full Name</label>
                <input className="input-field" {...register('name', { required: true })} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Email</label>
                <input className="input-field" {...register('email', { required: true })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" icon={Save}>Save Changes</Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </ChartCard>

        <ChartCard title="Activity Summary">
          <div className="space-y-4">
            <Stat label="Items Scanned" value="184" />
            <Stat label="Reports Generated" value="27" />
            <Stat label="Alerts Resolved" value="63" />
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-graphite-100 p-3 dark:border-graphite-800">
      <Icon className="h-4 w-4 text-emerald-600" />
      <div>
        <p className="text-xs text-graphite-400">{label}</p>
        <p className="text-sm font-semibold text-graphite-800 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-graphite-50 px-4 py-3 dark:bg-graphite-800/50">
      <span className="text-sm text-graphite-500 dark:text-graphite-400">{label}</span>
      <span className="font-display text-lg font-bold text-graphite-800 dark:text-white">{value}</span>
    </div>
  )
}
