import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function RoleProtectedRoute({ allowedRoles = [] }) {
  const { user, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  const userRole = (user.role || "consumer").toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  if (allowedRoles.length > 0 && !normalizedAllowed.includes(userRole)) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}

export default RoleProtectedRoute;
