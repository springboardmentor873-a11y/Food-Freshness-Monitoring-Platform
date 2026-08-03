import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { USER_ROLES } from '../constants/mockData';
import { Sparkles, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { toast } from 'react-hot-toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('sarah.vance@freshness.ai');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.ADMINISTRATOR);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required credentials.');
      return;
    }
    login(email, password, selectedRole);
    toast.success(`Logged in successfully as ${selectedRole}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#07111f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#07111f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI Food Freshness
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Sign In</h2>
          <p className="text-xs text-slate-400">Access platform telemetry & AI freshness tools</p>
        </div>

        <GlassCard className="p-8 border-emerald-500/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Access Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50 backdrop-blur-md font-medium"
              >
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role} value={role} className="bg-[#0c1e33] text-slate-100">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-emerald-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/30"
                />
                <span>Remember session (JWT)</span>
              </label>
            </div>

            <GlassButton variant="primary" size="lg" className="w-full" icon={ArrowRight}>
              Sign In to Platform
            </GlassButton>

            {/* OAuth Buttons */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0c1e33] px-2 text-slate-400 font-mono">Or OAuth Sign In</span></div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  login('google.user@freshness.ai', 'pass', selectedRole);
                  toast.success('Signed in via Google OAuth');
                  navigate('/dashboard');
                }}
                className="py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 hover:bg-white/10 font-medium text-center"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => {
                  login('github.user@freshness.ai', 'pass', selectedRole);
                  toast.success('Signed in via GitHub OAuth');
                  navigate('/dashboard');
                }}
                className="py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 hover:bg-white/10 font-medium text-center"
              >
                GitHub
              </button>
              <button
                type="button"
                onClick={() => {
                  login('microsoft.user@freshness.ai', 'pass', selectedRole);
                  toast.success('Signed in via Microsoft OAuth');
                  navigate('/dashboard');
                }}
                className="py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 hover:bg-white/10 font-medium text-center"
              >
                Microsoft
              </button>
            </div>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
            Create Enterprise Account
          </Link>
        </p>
      </div>
    </div>
  );
};
