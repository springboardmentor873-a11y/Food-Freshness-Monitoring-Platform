import React from 'react';
import { useApp, PageId } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  ScanLine, 
  Package, 
  Sparkles, 
  Clock, 
  Thermometer, 
  Lightbulb, 
  BarChart3, 
  FileText, 
  Bell, 
  Settings, 
  HelpCircle, 
  User as UserIcon,
  Shield, 
  Cpu, 
  Leaf, 
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentPage, setCurrentPage, notifications, inventory } = useApp();
  const { user } = useAuth();

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const atRiskInventoryCount = inventory.filter(
    (i) => i.status === 'Expiring Soon' || i.status === 'Critical'
  ).length;

  const navItems: { id: PageId; label: string; icon: React.ElementType; badge?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Food', icon: ScanLine, badge: 'AI', badgeColor: 'bg-emerald-500 text-white' },
    { id: 'inventory', label: 'Inventory', icon: Package, badge: atRiskInventoryCount > 0 ? atRiskInventoryCount : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'freshness', label: 'Freshness Scoring', icon: Sparkles },
    { id: 'shelflife', label: 'Shelf Life Predictor', icon: Clock },
    { id: 'storage', label: 'Storage Monitoring', icon: Thermometer },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Audits', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined, badgeColor: 'bg-rose-500 text-white' },
  ];

  const adminNavItems: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'admin-users', label: 'User Management', icon: Shield },
    { id: 'admin-model', label: 'AI Model Telemetry', icon: Cpu },
  ];

  const handleNavClick = (pageId: PageId) => {
    setCurrentPage(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Logo Icon with leaf & neural scan pulse */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-lime-300 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">FreshSense</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">AI</span>
              </div>
              <p className="text-[9px] font-medium text-slate-600 dark:text-slate-300 tracking-wider uppercase">Food Quality OS</p>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Platform Modules
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id || 
                  (item.id === 'analyze' && currentPage === 'analysis-detail') ||
                  (item.id === 'inventory' && currentPage === 'inventory-detail');

                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Admin & System Section */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Admin & ML Engine</span>
              {user?.role === 'Administrator' && (
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Admin Active</span>
              )}
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-slate-800 text-white dark:bg-emerald-600'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Utility Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Account & Help
            </div>
            <nav className="space-y-1">
              <button
                id="nav-profile"
                onClick={() => handleNavClick('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentPage === 'profile'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>Profile & Stats</span>
              </button>
              <button
                id="nav-settings"
                onClick={() => handleNavClick('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentPage === 'settings'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>
              <button
                id="nav-help"
                onClick={() => handleNavClick('help')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentPage === 'help'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Help & AI Guide</span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Card at Bottom */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div 
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
          >
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {user?.name}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                {user?.role}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
