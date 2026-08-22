import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { FunkyBackground } from './components/layout/FunkyBackground';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/ui/ToastContainer';
import { GlobalSearchModal } from './components/ui/GlobalSearchModal';
import { OnboardingModal } from './components/ui/OnboardingModal';

// Pages
import { LandingPage } from './pages/auth/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardRouter } from './pages/dashboard/DashboardRouter';
import { AnalyzePage } from './pages/analysis/AnalyzePage';
import { FreshnessPage } from './pages/analysis/FreshnessPage';
import { AnalysisDetailPage } from './pages/analysis/AnalysisDetailPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { InventoryDetailPage } from './pages/inventory/InventoryDetailPage';
import { ShelfLifePage } from './pages/shelflife/ShelfLifePage';
import { StorageMonitoringPage } from './pages/storage/StorageMonitoringPage';
import { RecommendationsPage } from './pages/recommendations/RecommendationsPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpSupportPage } from './pages/help/HelpSupportPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminModelPage } from './pages/admin/AdminModelPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, switchRole } = useAuth();
  const { currentPage, setCurrentPage } = useApp();

  const [authView, setAuthView] = useState<'landing' | 'login' | 'register' | 'forgot'>('landing');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // If user is not logged in and on an auth view
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage
          onRegisterClick={() => setAuthView('register')}
          onForgotPasswordClick={() => setAuthView('forgot')}
        />
      );
    }
    if (authView === 'register') {
      return <RegisterPage onLoginClick={() => setAuthView('login')} />;
    }
    if (authView === 'forgot') {
      return <ForgotPasswordPage onBackToLogin={() => setAuthView('login')} />;
    }
    return (
      <LandingPage
        onGetStarted={() => {
          switchRole('Consumer');
        }}
        onLogin={() => setAuthView('login')}
      />
    );
  }

  // Render the current authenticated page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardRouter />;
      case 'analyze':
        return <AnalyzePage />;
      case 'freshness':
        return <FreshnessPage />;
      case 'analysis-detail':
        return <AnalysisDetailPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'inventory-detail':
        return <InventoryDetailPage />;
      case 'shelflife':
        return <ShelfLifePage />;
      case 'storage':
        return <StorageMonitoringPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpSupportPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-model':
        return <AdminModelPage />;
      default:
        return <DashboardRouter />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Ambient background decoration */}
      <FunkyBackground />

      {/* Main App Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar onTakeTour={() => setIsOnboardingOpen(true)} />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <Navbar onTakeTour={() => setIsOnboardingOpen(true)} />

          {/* Main Workspace Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
            {renderCurrentPage()}
          </main>
        </div>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
