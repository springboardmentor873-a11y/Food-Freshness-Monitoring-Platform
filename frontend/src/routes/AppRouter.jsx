import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";

// Lazy-loaded Workspaces
const LandingPage = lazy(() => import("../pages/Landing/LandingPage"));
const DashboardHome = lazy(() => import("../pages/Dashboard/DashboardHome"));
const FoodDetection = lazy(() => import("../pages/FoodDetection/FoodDetection"));
const Inventory = lazy(() => import("../pages/Inventory/Inventory"));
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));
const Reports = lazy(() => import("../pages/Reports/Reports"));
const Notifications = lazy(() => import("../pages/Notifications/Notifications"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Admin = lazy(() => import("../pages/Admin/Admin"));
const PredictionHistory = lazy(() => import("../pages/PredictionHistory/PredictionHistory"));

function LoadingFallback() {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Primary Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/food-detection" element={<FoodDetection />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/prediction-history" element={<PredictionHistory />} />

              {/* Admin-only Protected Route */}
              <Route element={<RoleProtectedRoute allowedRoles={["admin", "administrator"]} />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
