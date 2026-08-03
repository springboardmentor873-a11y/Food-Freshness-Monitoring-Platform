import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ImageAnalysisPage } from '../pages/ImageAnalysisPage';
import { FreshnessAssessmentPage } from '../pages/FreshnessAssessmentPage';
import { ShelfLifePredictionPage } from '../pages/ShelfLifePredictionPage';
import { StorageMonitoringPage } from '../pages/StorageMonitoringPage';
import { ReportsPage } from '../pages/ReportsPage';
import { NotificationCenterPage } from '../pages/NotificationCenterPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ProfileSettingsPage } from '../pages/ProfileSettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><ImageAnalysisPage /></ProtectedRoute>} />
          <Route path="/freshness" element={<ProtectedRoute><FreshnessAssessmentPage /></ProtectedRoute>} />
          <Route path="/shelf-life" element={<ProtectedRoute><ShelfLifePredictionPage /></ProtectedRoute>} />
          <Route path="/storage" element={<ProtectedRoute><StorageMonitoringPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationCenterPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};
