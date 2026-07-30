import { Navigate, useLocation } from "react-router-dom";

function isAuthenticated() {
  return Boolean(
    localStorage.getItem("ffm-auth-token") || localStorage.getItem("ffm_user")
  );
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
