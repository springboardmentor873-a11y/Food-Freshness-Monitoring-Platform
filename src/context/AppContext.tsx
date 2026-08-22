import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AnalysisResult, 
  FoodInventoryItem, 
  StorageSensorData, 
  NotificationItem, 
  ReportItem, 
  ModelMetadata,
  FoodCategory,
  RecommendationItem
} from '../types';
import { 
  INITIAL_ANALYSES, 
  INITIAL_INVENTORY, 
  INITIAL_STORAGE_SENSORS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REPORTS, 
  DEFAULT_MODEL_METADATA,
  INITIAL_RECOMMENDATIONS
} from '../data/mockData';
import { api } from '../services/api';

export type PageId = 
  | 'dashboard' 
  | 'analyze' 
  | 'analysis-detail'
  | 'inventory' 
  | 'inventory-detail'
  | 'freshness' 
  | 'shelflife' 
  | 'storage' 
  | 'recommendations' 
  | 'analytics' 
  | 'reports' 
  | 'notifications' 
  | 'profile' 
  | 'settings' 
  | 'help'
  | 'admin-users' 
  | 'admin-model';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  selectedAnalysisId: string | null;
  setSelectedAnalysisId: (id: string | null) => void;
  selectedInventoryId: string | null;
  setSelectedInventoryId: (id: string | null) => void;
  
  // Data State
  analyses: AnalysisResult[];
  inventory: FoodInventoryItem[];
  storageSensors: StorageSensorData[];
  notifications: NotificationItem[];
  reports: ReportItem[];
  qualityReports: ReportItem[];
  recommendations: RecommendationItem[];
  modelMetadata: ModelMetadata;
  
  // Actions
  addAnalysis: (analysis: AnalysisResult) => void;
  deleteAnalysis: (id: string) => void;
  addInventoryItem: (item: Omit<FoodInventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<FoodInventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  addRecommendation: (rec: Omit<RecommendationItem, 'id'>) => void;
  dismissRecommendation: (id: string) => void;
  executeRecommendation: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  generateNewReport: (type: ReportItem['type'], title: string) => Promise<ReportItem>;
  
  // Search & Global Modals
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Mode & Theme
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (demo: boolean) => void;
  setDemoMode: (demo: boolean) => void;
  
  // Toast system
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>('scan-1001');
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>('inv-001');
  
  const [analyses, setAnalyses] = useState<AnalysisResult[]>(() => {
    const saved = localStorage.getItem('freshsense_analyses');
    if (saved) {
      try {
        const parsed: AnalysisResult[] = JSON.parse(saved);
        const seen = new Set<string>();
        const unique = parsed.filter((item) => {
          if (!item.id || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        return unique.length > 0 ? unique : INITIAL_ANALYSES;
      } catch {
        return INITIAL_ANALYSES;
      }
    }
    return INITIAL_ANALYSES;
  });

  const [inventory, setInventory] = useState<FoodInventoryItem[]>(() => {
    const saved = localStorage.getItem('freshsense_inventory');
    if (saved) {
      try {
        const parsed: FoodInventoryItem[] = JSON.parse(saved);
        const seen = new Set<string>();
        const unique = parsed.filter((item) => {
          if (!item.id || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        return unique.length > 0 ? unique : INITIAL_INVENTORY;
      } catch {
        return INITIAL_INVENTORY;
      }
    }
    return INITIAL_INVENTORY;
  });

  const [storageSensors, setStorageSensors] = useState<StorageSensorData[]>(INITIAL_STORAGE_SENSORS);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('freshsense_notifications');
    if (saved) {
      try {
        const parsed: NotificationItem[] = JSON.parse(saved);
        const seen = new Set<string>();
        const unique = parsed.filter((item) => {
          if (!item.id || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        return unique.length > 0 ? unique : INITIAL_NOTIFICATIONS;
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('freshsense_reports');
    if (saved) {
      try {
        const parsed: ReportItem[] = JSON.parse(saved);
        const seen = new Set<string>();
        const unique = parsed.filter((item) => {
          if (!item.id || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        return unique.length > 0 ? unique : INITIAL_REPORTS;
      } catch {
        return INITIAL_REPORTS;
      }
    }
    return INITIAL_REPORTS;
  });

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(() => {
    const saved = localStorage.getItem('freshsense_recommendations');
    if (saved) {
      try {
        const parsed: RecommendationItem[] = JSON.parse(saved);
        const seen = new Set<string>();
        const unique = parsed.filter((item) => {
          if (!item.id || seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        return unique.length > 0 ? unique : INITIAL_RECOMMENDATIONS;
      } catch {
        return INITIAL_RECOMMENDATIONS;
      }
    }
    return INITIAL_RECOMMENDATIONS;
  });

  const [modelMetadata] = useState<ModelMetadata>(DEFAULT_MODEL_METADATA);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('freshsense_theme');
    if (saved) {
      const isDark = saved === 'dark';
      if (typeof document !== 'undefined') {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return isDark;
    }
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (typeof document !== 'undefined') {
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return prefersDark;
  });
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    return api.getDemoMode();
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('freshsense_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('freshsense_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('freshsense_analyses', JSON.stringify(analyses));
  }, [analyses]);

  useEffect(() => {
    localStorage.setItem('freshsense_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('freshsense_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('freshsense_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('freshsense_recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  const setIsDemoMode = (val: boolean) => {
    setIsDemoModeState(val);
    api.setDemoMode(val);
    addToast({
      type: 'info',
      title: val ? 'Demo Mode Active' : 'Production AI Engine Active',
      message: val 
        ? 'Using simulated food freshness models and offline samples.' 
        : 'Connecting to server-side Gemini Vision AI & active neural pipeline.'
    });
  };

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addAnalysis = useCallback((analysis: AnalysisResult) => {
    setAnalyses((prev) => {
      // Prevent duplicates with the same id
      const existingIndex = prev.findIndex((a) => a.id === analysis.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = analysis;
        return next;
      }
      return [analysis, ...prev];
    });
    setSelectedAnalysisId(analysis.id);
    
    // Also generate notification if near spoilage or spoiled
    if (analysis.predictedClass === 'Near Spoilage' || analysis.predictedClass === 'Spoiled') {
      const notifId = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const notif: NotificationItem = {
        id: notifId,
        title: `Spoilage Alert: ${analysis.foodName}`,
        description: `Score dropped to ${analysis.freshnessScore}/100. Category: ${analysis.predictedClass}. Risk level: ${analysis.riskLevel}.`,
        timestamp: 'Just now',
        category: 'Spoilage Alert',
        severity: 'critical',
        read: false,
        actionUrl: '/analysis-detail',
        actionText: 'View Scan'
      };
      setNotifications((prev) => [notif, ...prev.filter(n => n.id !== notifId)]);
    }
  }, []);

  const deleteAnalysis = useCallback((id: string) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    addToast({
      type: 'info',
      title: 'Analysis Removed',
      message: 'The record has been permanently deleted from scan history.'
    });
  }, [addToast]);

  const addInventoryItem = useCallback((item: Omit<FoodInventoryItem, 'id'>) => {
    const newItem: FoodInventoryItem = {
      ...item,
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };
    setInventory((prev) => [newItem, ...prev.filter(i => i.id !== newItem.id)]);
    addToast({
      type: 'success',
      title: 'Item Added to Inventory',
      message: `${item.name} (${item.quantity} ${item.unit}) registered under Batch ${item.batchId}.`
    });
  }, [addToast]);

  const updateInventoryItem = useCallback((id: string, updates: Partial<FoodInventoryItem>) => {
    setInventory((prev) => prev.map((item) => item.id === id ? { ...item, ...updates } : item));
    addToast({
      type: 'success',
      title: 'Inventory Updated',
      message: 'Item details and storage parameters successfully saved.'
    });
  }, [addToast]);

  const deleteInventoryItem = useCallback((id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Inventory record removed from monitoring index.'
    });
  }, [addToast]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'All Cleared',
      message: 'All notifications marked as read.'
    });
  }, [addToast]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addRecommendation = useCallback((rec: Omit<RecommendationItem, 'id'>) => {
    const newRec: RecommendationItem = {
      ...rec,
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };
    setRecommendations((prev) => [newRec, ...prev]);
  }, []);

  const dismissRecommendation = useCallback((id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    addToast({
      type: 'info',
      title: 'Recommendation Dismissed',
      message: 'Recommendation archived from the active priority feed.'
    });
  }, [addToast]);

  const executeRecommendation = useCallback((id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, implemented: true } : r))
    );
  }, []);

  const generateNewReport = async (type: ReportItem['type'], title: string): Promise<ReportItem> => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      type,
      generatedDate: new Date().toISOString().split('T')[0],
      dateRange: 'Current Cycle',
      generatedBy: 'FreshSense Telemetry Engine',
      format: 'PDF',
      fileSize: `${(1.2 + Math.random() * 1.5).toFixed(1)} MB`,
      summary: {
        totalScanned: analyses.length * 24 + 120,
        avgFreshness: Math.round(inventory.reduce((acc, curr) => acc + curr.freshnessScore, 0) / inventory.length),
        spoilageRate: 2.8,
        wasteAvertedKg: Math.round(inventory.length * 145.5)
      }
    };
    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedAnalysisId,
        setSelectedAnalysisId,
        selectedInventoryId,
        setSelectedInventoryId,
        analyses,
        inventory,
        storageSensors,
        notifications,
        reports,
        qualityReports: reports,
        recommendations,
        modelMetadata,
        addAnalysis,
        deleteAnalysis,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addRecommendation,
        dismissRecommendation,
        executeRecommendation,
        markNotificationRead,
        markNotificationAsRead: markNotificationRead,
        markAllNotificationsRead,
        markAllNotificationsAsRead: markAllNotificationsRead,
        deleteNotification,
        generateNewReport,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        isDemoMode,
        setIsDemoMode,
        setDemoMode: setIsDemoMode,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
