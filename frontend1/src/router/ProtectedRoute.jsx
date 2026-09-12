import { Navigate, useLocation } from "react-router-dom";

function isAuthenticated() {
  const token = localStorage.getItem("ffm-auth-token");
  const userStr = localStorage.getItem("ffm_user");
  if (!token || !userStr || userStr === "null" || userStr === "undefined") {
    return false;
  }
  try {
    const userObj = JSON.parse(userStr);
    return Boolean(userObj && (userObj.id || userObj.name || userObj.username));
  } catch (e) {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
