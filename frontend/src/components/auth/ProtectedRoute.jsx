import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute() {
  const { user, isInitializing } = useAuth();
  const location = useLocation();
  if (isInitializing) return <div className="min-h-screen bg-slate-50" />;
  return user ? <Outlet /> : <Navigate replace state={{ from: location }} to="/login" />;
}

export default ProtectedRoute;
