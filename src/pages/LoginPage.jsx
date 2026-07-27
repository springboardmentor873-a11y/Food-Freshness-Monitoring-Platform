import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Leaf, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const result = await login(data)
      toast.success(`Welcome back, ${result.user.name}!`)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    toast('Google OAuth is simulated in this frontend-only build.', { icon: '🔐' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Link to="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-glow">
            <Leaf className="h-6 w-6 text-white" />
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-graphite-800 dark:text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-graphite-500 dark:text-graphite-400">Log in to your FreshEye AI dashboard</p>
        </div>

        <button onClick={handleGoogleLogin} className="btn-secondary w-full">
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 000 12c0 1.93.46 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-graphite-400">
          <div className="h-px flex-1 bg-graphite-200 dark:bg-graphite-700" /> OR <div className="h-px flex-1 bg-graphite-200 dark:bg-graphite-700" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
              <input
                type="email"
                placeholder="you@company.com"
                className="input-field pl-9"
                {...register('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-600 dark:text-graphite-300">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-field pl-9 pr-9"
                {...register('password', { required: 'Password is required', minLength: { value: 4, message: 'Minimum 4 characters' } })}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-graphite-500 dark:text-graphite-400">
              <input type="checkbox" className="h-4 w-4 rounded border-graphite-300 text-emerald-600 focus:ring-emerald-500" {...register('remember')} />
              Remember me
            </label>
            <button type="button" onClick={() => toast('Password reset link sent (simulated).', { icon: '✉️' })} className="font-medium text-emerald-600 hover:text-emerald-700">
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-graphite-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin demo: admin@fresheye.ai / any password
        </p>

        <p className="mt-5 text-center text-sm text-graphite-500 dark:text-graphite-400">
          Don't have an account? <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}
