import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Thermometer, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    setCurrentPage,
    setSelectedInventoryId,
    setSelectedAnalysisId
  } = useApp();

  const [filterType, setFilterType] = useState('All');

  const filtered = notifications.filter((n) => {
    if (filterType === 'All') return true;
    if (filterType === 'Unread') return !n.read;
    return n.category === filterType || (n as any).type === filterType;
  });

  const handleNotificationClick = (n: any) => {
    markNotificationAsRead(n.id);
    if (n.actionUrl) {
      if (n.actionUrl.includes('analysis-detail') || n.actionUrl.includes('scan')) {
        setSelectedAnalysisId('scan-1001');
        setCurrentPage('analysis-detail');
      } else if (n.actionUrl.includes('inventory')) {
        setCurrentPage('inventory');
      } else if (n.actionUrl.includes('storage')) {
        setCurrentPage('storage');
      } else if (n.actionUrl.includes('reports')) {
        setCurrentPage('reports');
      } else if (n.actionUrl.includes('recommendations')) {
        setCurrentPage('recommendations');
      }
    } else if (n.linkId) {
      if (String(n.category || n.type || '').includes('Shelf-Life') || String(n.category || n.type || '').includes('Storage')) {
        setSelectedInventoryId(n.linkId);
        setCurrentPage('inventory-detail');
      } else {
        setSelectedAnalysisId(n.linkId);
        setCurrentPage('analysis-detail');
      }
    }
  };

  return (
    <div id="notifications-page" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Bell className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Alerts & Notification Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time warnings on produce shelf-life expiry, temperature violations, and spoilage risk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {['All', 'Unread', 'Freshness Alert', 'Shelf-Life Warning', 'Storage Condition Alert', 'Spoilage Alert', 'System Notification'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterType === type
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p>No notifications match your selected filter.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const cat = n.category || (n as any).type || '';
            let icon = <Sparkles className="w-4 h-4 text-emerald-500" />;
            if (cat.includes('Shelf-Life')) icon = <Clock className="w-4 h-4 text-amber-500" />;
            if (cat.includes('Storage')) icon = <Thermometer className="w-4 h-4 text-rose-500" />;
            if (cat.includes('Spoilage')) icon = <AlertTriangle className="w-4 h-4 text-rose-500" />;

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  n.read
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs mt-0.5">
                    {icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {n.description || (n as any).message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1.5 block">
                      {n.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {(n.actionUrl || (n as any).linkId) && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <span>{n.actionText || 'View'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
