import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { USER_ROLES } from '../constants/mockData';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Avatar } from '../components/common/SearchBar';
import { User, Mail, Phone, Building, ShieldCheck, Key, Settings, Bell, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  const { user, setRole, updateProfile, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [company, setCompany] = useState(user?.company || '');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.freshness.ai/v1');

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, email, phone, company });
    toast.success('Profile preferences updated.');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-emerald-400" /> Account & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage user profile, active role credentials, notification settings, and FastAPI endpoints.
        </p>
      </div>

      {/* User Header Profile */}
      <GlassCard className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-emerald-500/30">
        <div className="flex items-center space-x-4">
          <Avatar src={user?.avatar} name={user?.name} role={user?.role} size="lg" />
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <span className="text-xs text-emerald-400 font-mono">{user?.email}</span>
            <div className="mt-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Active Role: {user?.role}
              </span>
            </div>
          </div>
        </div>

        <GlassButton variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
          Sign Out
        </GlassButton>
      </GlassCard>

      {/* Form Settings */}
      <GlassCard className="p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Active Role Selector
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(USER_ROLES).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setRole(role);
                    toast.success(`Role changed to ${role}`);
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    user?.role === role
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* FastAPI Endpoint Config */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" /> FastAPI Backend Configuration
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">FastAPI Gateway URL</label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-mono text-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <GlassButton variant="primary" size="lg" className="w-full">
            Save Profile & Preferences
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
};
