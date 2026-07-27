import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from './ProtectedRoute.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'

import LandingPage from '../pages/LandingPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import SignupPage from '../pages/SignupPage.jsx'
import RoleSelectionPage from '../pages/RoleSelectionPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import InventoryPage from '../pages/InventoryPage.jsx'
import ImageAnalysisPage from '../pages/ImageAnalysisPage.jsx'
import FreshnessAssessmentPage from '../pages/FreshnessAssessmentPage.jsx'
import ShelfLifePredictionPage from '../pages/ShelfLifePredictionPage.jsx'
import StorageMonitoringPage from '../pages/StorageMonitoringPage.jsx'
import RecommendationsPage from '../pages/RecommendationsPage.jsx'
import AnalyticsPage from '../pages/AnalyticsPage.jsx'
import ReportsPage from '../pages/ReportsPage.jsx'
import NotificationsPage from '../pages/NotificationsPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import AboutPage from '../pages/AboutPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import UserManagementPage from '../pages/UserManagementPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

export default function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
        </Route>

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/image-analysis" element={<ImageAnalysisPage />} />
          <Route path="/freshness-assessment" element={<FreshnessAssessmentPage />} />
          <Route path="/shelf-life-prediction" element={<ShelfLifePredictionPage />} />
          <Route path="/storage-monitoring" element={<StorageMonitoringPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user-management" element={<ProtectedRoute adminOnly><UserManagementPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}
