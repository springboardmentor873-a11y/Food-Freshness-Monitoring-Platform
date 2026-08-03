import React from 'react';
import { useNotificationStore } from '../store/useNotificationStore';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Bell, Check, Trash2, AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const NotificationCenterPage = () => {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-7 h-7 text-emerald-400" /> Notification Center
          </h1>
          <p className="text-xs text-slate-400">Real-time freshness drift, expiry warnings, and telemetry alerts.</p>
        </div>

        <div className="flex space-x-2">
          <GlassButton variant="outline" size="sm" icon={Check} onClick={() => { markAllAsRead(); toast.success('All marked as read'); }}>
            Mark All Read
          </GlassButton>
          <GlassButton variant="ghost" size="sm" icon={Trash2} onClick={() => { clearAll(); toast.success('Cleared notifications'); }}>
            Clear All
          </GlassButton>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <GlassCard className="p-8 text-center text-slate-400 text-sm">
            No active notifications. All systems optimal.
          </GlassCard>
        ) : (
          notifications.map((n) => (
            <GlassCard
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 border-l-4 transition-all cursor-pointer ${
                n.unread ? 'bg-white/[0.07] border-l-emerald-400' : 'border-l-transparent opacity-80'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold ${n.unread ? 'text-white' : 'text-slate-300'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
