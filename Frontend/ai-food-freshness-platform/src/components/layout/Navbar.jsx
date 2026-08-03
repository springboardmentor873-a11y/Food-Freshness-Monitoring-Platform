import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { USER_ROLES } from '../../constants/mockData';
import {
  LayoutDashboard,
  Boxes,
  Camera,
  Gauge,
  Hourglass,
  Thermometer,
  FileText,
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../common/SearchBar';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setRole, logout, isAuthenticated } = useAuthStore();
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => n.unread).length;
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Boxes },
    { name: 'AI Scan', path: '/analysis', icon: Camera },
    { name: 'Freshness', path: '/freshness', icon: Gauge },
    { name: 'Shelf Life', path: '/shelf-life', icon: Hourglass },
    { name: 'Storage', path: '/storage', icon: Thermometer },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07111f]/80 backdrop-blur-xl border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <div className="w-full h-full bg-[#07111f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent tracking-tight">
                AI Food Freshness
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Enterprise Platform
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Role Switcher, Notifications, User */}
          <div className="flex items-center space-x-3">
            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors"
                title="Switch active viewing role"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline font-mono text-[11px] text-emerald-400">{user?.role}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0c1e33] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl">
                  <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-white/10 mb-1">
                    Select Active Role
                  </div>
                  {Object.values(USER_ROLES).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                        user?.role === role
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{role}</span>
                      {user?.role === role && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Avatar */}
            <Link to="/profile" className="flex items-center space-x-2">
              <Avatar src={user?.avatar} name={user?.name} role={user?.role} size="sm" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
