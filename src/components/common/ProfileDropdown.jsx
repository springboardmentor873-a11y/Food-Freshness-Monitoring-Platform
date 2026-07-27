import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, User, Settings, LogOut, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth.js'

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  if (!user) return null
  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-graphite-100 dark:hover:bg-graphite-800 transition-colors">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-bold text-white">
          {initials}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-none text-graphite-800 dark:text-white">{user.name}</p>
          <p className="text-[11px] text-graphite-400">{user.role}</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-graphite-400 sm:block" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            className="glass-card absolute right-0 top-12 z-50 w-56 p-2"
          >
            <div className="border-b border-graphite-200/60 dark:border-graphite-800 px-3 py-2">
              <p className="truncate text-sm font-semibold text-graphite-800 dark:text-white">{user.name}</p>
              <p className="truncate text-xs text-graphite-400">{user.email}</p>
            </div>
            <Link to="/profile" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-graphite-600 hover:bg-graphite-100 dark:text-graphite-300 dark:hover:bg-graphite-800">
              <User className="h-4 w-4" /> My Profile
            </Link>
            <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-graphite-600 hover:bg-graphite-100 dark:text-graphite-300 dark:hover:bg-graphite-800">
              <Settings className="h-4 w-4" /> Settings
            </Link>
            {user.role === 'Administrator' && (
              <Link to="/user-management" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-graphite-600 hover:bg-graphite-100 dark:text-graphite-300 dark:hover:bg-graphite-800">
                <ShieldCheck className="h-4 w-4" /> User Management
              </Link>
            )}
            <button onClick={handleLogout} className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
