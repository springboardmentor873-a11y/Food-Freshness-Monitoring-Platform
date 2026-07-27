import { useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2, ShieldCheck, Search } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb.jsx'
import ChartCard from '../components/common/ChartCard.jsx'
import SearchBar from '../components/common/SearchBar.jsx'
import Badge from '../components/common/Badge.jsx'
import Modal from '../components/common/Modal.jsx'
import Button from '../components/common/Button.jsx'
import { useAuth } from '../hooks/useAuth.js'

const ROLE_COLORS = {
  Administrator: 'rose',
  'Food Quality Inspector': 'violet',
  'Warehouse Operator': 'sky',
  'Retail Manager': 'amber',
  Consumer: 'graphite'
}

export default function UserManagementPage() {
  const { user, getAllUsers, deleteUser } = useAuth()
  const [users, setUsers] = useState(getAllUsers())
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState(null)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  )

  const confirmDelete = () => {
    deleteUser(target.id)
    setUsers(getAllUsers())
    toast.success(`${target.name} was removed from the platform.`)
    setTarget(null)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'User Management' }]} />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-graphite-800 dark:text-white">User Management</h2>
          <p className="text-sm text-graphite-500 dark:text-graphite-400">Manage every account registered on this instance of FreshEye AI.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4" /> Administrator access
        </div>
      </div>

      <ChartCard title="All Users" subtitle={`${users.length} account(s) registered`}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name or email..." className="mb-4 max-w-sm" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-graphite-100 text-xs uppercase text-graphite-400 dark:border-graphite-800">
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Joined</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-graphite-50 dark:border-graphite-800/50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-700 text-xs font-bold text-white">
                        {u.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <span className="font-medium text-graphite-700 dark:text-graphite-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-graphite-500">{u.email}</td>
                  <td className="px-3 py-3"><Badge color={ROLE_COLORS[u.role] || 'graphite'}>{u.role}</Badge></td>
                  <td className="px-3 py-3 text-graphite-500">{new Date(u.joinedAt).toLocaleDateString()}</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      disabled={u.id === user.id}
                      onClick={() => setTarget(u)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-30 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-graphite-400">No matching users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <Modal open={!!target} onClose={() => setTarget(null)} title="Remove User" size="sm">
        <p className="text-sm text-graphite-600 dark:text-graphite-300">
          Are you sure you want to permanently remove <span className="font-semibold">{target?.name}</span> ({target?.email}) from the platform? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Remove User</Button>
        </div>
      </Modal>
    </div>
  )
}
