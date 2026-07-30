import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import { FullPageLoader } from "../components/ui/Loader";

// Lazy-loaded pages
const WelcomePage = lazy(() => import("../pages/WelcomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const AdminLoginPage = lazy(() => import("../pages/AdminLoginPage"));

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const FoodAnalysisPage = lazy(() => import("../pages/FoodAnalysisPage"));
const PredictionResultsPage = lazy(() => import("../pages/PredictionResultsPage"));
const InventoryPage = lazy(() => import("../pages/InventoryPage"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage"));
const ReportsPage = lazy(() => import("../pages/ReportsPage"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export default function AppRouter() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        {/* Entry Flow — Welcome Screen at / */}
        <Route path="/" element={<WelcomePage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Public marketing pages */}
        <Route element={<PublicLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Main User Dashboard at /dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Separate Admin Dashboard at /admin-dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
        </Route>

        {/* Authenticated app sub-routes under /app/* */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="analyze" element={<FoodAnalysisPage />} />
          <Route path="analyze/results/:id" element={<PredictionResultsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
