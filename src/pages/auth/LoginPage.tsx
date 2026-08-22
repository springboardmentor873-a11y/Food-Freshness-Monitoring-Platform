import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Leaf, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Store, 
  Building2, 
  Microscope, 
  Eye, 
  EyeOff, 
  Sparkles,
  AlertCircle,
  Check
} from 'lucide-react';

interface LoginPageProps {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onRegisterClick, onForgotPasswordClick }) => {
  const { login, switchRole, isLoading } = useAuth();
  const { addToast } = useApp();

  const [email, setEmail] = useState('eleanor.vance@freshsense.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Consumer');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = await login(email, password, selectedRole);
    if (res.success) {
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back to FreshSense AI.`
      });
    } else {
      setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
      addToast({
        type: 'warning',
        title: 'Sign In Failed',
        message: res.error || 'Invalid credentials provided.'
      });
    }
  };

  const handleQuickDemoRole = (role: UserRole) => {
    switchRole(role);
    addToast({
      type: 'info',
      title: `Signed In: ${role}`,
      message: `Switched into live ${role} workspace.`
    });
  };

  const fillCredentials = (demoEmail: string, role: UserRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setSelectedRole(role);
    setErrorMessage(null);
  };

  return (
    <div id="login-page" className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Sign In to FreshSense AI
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access multi-modal freshness scoring, cold-chain telemetry, and predictive waste analytics.
          </p>
        </div>

        {/* 1-Click Role Logins */}
        <div className="space-y-2.5 pt-1 bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Instant 1-Click Role Access
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Live Demo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoRole('Consumer')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-left"
            >
              <Leaf className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <div className="truncate">Consumer</div>
                <div className="text-[9px] text-slate-400 font-normal truncate">Smart Pantry</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoRole('Retail Manager')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-teal-500 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors text-left"
            >
              <Store className="w-4 h-4 text-teal-500 shrink-0" />
              <div className="min-w-0">
                <div className="truncate">Retail Manager</div>
                <div className="text-[9px] text-slate-400 font-normal truncate">FIFO & Aisles</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoRole('Warehouse Operator')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors text-left"
            >
              <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <div className="min-w-0">
                <div className="truncate">Warehouse</div>
                <div className="text-[9px] text-slate-400 font-normal truncate">Cold Vaults</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoRole('Food Quality Inspector')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-rose-500 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
            >
              <Microscope className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <div className="truncate">Inspector</div>
                <div className="text-[9px] text-slate-400 font-normal truncate">Safety Audits</div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">or email authentication</span>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="name@organization.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Session Persona / Role
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
              >
                <option value="Consumer">Consumer (Smart Kitchen)</option>
                <option value="Retail Manager">Retail Manager (Supermarket & FIFO)</option>
                <option value="Warehouse Operator">Warehouse Operator (Cold Logistics)</option>
                <option value="Food Quality Inspector">Food Quality Inspector (Lab & Safety)</option>
                <option value="Administrator">Administrator (System & Model Telemetry)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to FreshSense'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick credential fills */}
        <div className="pt-1 text-center">
          <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Quick Fill Sample Account:</span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => fillCredentials('demo.consumer@freshsense.ai', 'Consumer')}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950 font-bold"
            >
              Sarah (Consumer)
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('demo.retail@freshsense.ai', 'Retail Manager')}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-100 dark:hover:bg-teal-950 font-bold"
            >
              Marcus (Retail)
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('demo.admin@freshsense.ai', 'Administrator')}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950 font-bold"
            >
              Admin (Core)
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-1">
          Don't have an account yet?{' '}
          <button
            onClick={onRegisterClick}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
