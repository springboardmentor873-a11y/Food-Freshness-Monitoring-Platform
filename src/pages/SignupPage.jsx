import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Leaf, Mail, Lock, User, Eye, EyeOff, ShoppingBasket, Store, Warehouse, ClipboardCheck, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'

const ROLES = [
  { id: 'Consumer', icon: ShoppingBasket, desc: 'Track freshness of foods at home' },
  { id: 'Retail Manager', icon: Store, desc: 'Manage store inventory & shelf life' },
  { id: 'Warehouse Operator', icon: Warehouse, desc: 'Monitor storage & bulk stock' },
  { id: 'Food Quality Inspector', icon: ClipboardCheck, desc: 'Audit freshness & compliance' },
  { id: 'Administrator', icon: ShieldCheck, desc: 'Full platform administration' },
]

export default function SignupPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'Consumer')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const result = await signup({ ...data, role })
      toast.success(`Account created — welcome, ${result.user.name}!`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Sign up failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        className="glass-card w-full max-w-lg p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-glow">
            <Leaf className="h-6 w-6 text-white" />
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-graphite-800 dark:text-white">Create your account</h1>
          <p className="mt-1 text-sm text-graphite-500 dark:text-graphite-400">Choose your role and set up your dashboard</p>
        </div>

        <p className="mb-2 text-sm font-medium text-graphite-600 dark:text-graphite-300">I am a...</p>
        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ROLES.map((r) => (
            <button
              type="button"
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                role === r.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-graphite-200 hover:border-emerald-300 dark:border-graphite-700'
              }`}
            >
              <r.icon className={`h-4 w-4 shrink-0 ${role === r.id ? 'text-emerald-600' : 'text-graphite-400'}`} />
              <div>
                <p className="text-xs font-semibold text-graphite-800 dark:text-white">{r.id}</p>
                <p className="text-[10px] text-graphite-400">{r.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Full name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
              <input placeholder="Aditi Sharma" className="input-field pl-9" {...register('name', { required: 'Name is required' })} />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
              <input type="email" placeholder="you@company.com" className="input-field pl-9" {...register('email', { required: 'Email is required' })} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-9 pr-9"
                  {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                {...register('confirmPassword', {
                  required: 'Required',
                  validate: (v) => v === password || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Creating account...' : `Sign Up as ${role}`}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-graphite-500 dark:text-graphite-400">
          Already have an account? <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Log in</Link>
        </p>
      </motion.div>
    </div>
  )
}
