import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, ShoppingBasket, Store, Warehouse, ClipboardCheck, ShieldCheck, ArrowRight } from 'lucide-react'

const ROLES = [
  { id: 'Consumer', icon: ShoppingBasket, desc: 'Check freshness of groceries and pantry items at home before you cook or shop again.' },
  { id: 'Retail Manager', icon: Store, desc: 'Keep shelves stocked with fresh inventory and cut down on markdown losses.' },
  { id: 'Warehouse Operator', icon: Warehouse, desc: 'Monitor bulk storage conditions and rotate stock before it turns.' },
  { id: 'Food Quality Inspector', icon: ClipboardCheck, desc: 'Audit batches against freshness and compliance standards.' },
  { id: 'Administrator', icon: ShieldCheck, desc: 'Manage users, permissions and platform-wide settings.' },
]

export default function RoleSelectionPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16">
      <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-glow">
        <Leaf className="h-6 w-6 text-white" />
      </Link>
      <h1 className="mt-5 text-center font-display text-3xl font-bold text-graphite-800 dark:text-white">Who's using FreshEye AI today?</h1>
      <p className="mt-2 text-center text-graphite-500 dark:text-graphite-400">Your role shapes the dashboard you'll see next.</p>

      <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLES.map((r, i) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate(`/signup?role=${encodeURIComponent(r.id)}`)}
            className="glass-card flex items-start gap-4 p-5 text-left hover:shadow-glass-lg"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <r.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-graphite-800 dark:text-white">{r.id}</p>
              <p className="mt-1 text-sm text-graphite-500 dark:text-graphite-400">{r.desc}</p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 text-graphite-300" />
          </motion.button>
        ))}
      </div>

      <p className="mt-8 text-sm text-graphite-500 dark:text-graphite-400">
        Already have an account? <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Log in</Link>
      </p>
    </div>
  )
}
