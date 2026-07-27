import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// Dashboard
import DashboardHome from "../pages/Dashboard/DashboardHome";

import FoodDetection from "../pages/FoodDetection/FoodDetection";
import Inventory from "../pages/Inventory/Inventory";
import Analytics from "../pages/Analytics/Analytics";
import Reports from "../pages/Reports/Reports";
import Notifications from "../pages/Notifications/Notifications";
import Profile from "../pages/Profile/Profile";
import Admin from "../pages/Admin/Admin";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page WITHOUT DashboardLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/food-detection" element={<FoodDetection />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;