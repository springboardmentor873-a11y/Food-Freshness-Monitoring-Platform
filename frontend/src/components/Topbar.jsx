import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="brand">
        <span className="brand-mark">FF</span>
        Harvest Ledger
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => (isActive ? "active" : "")}>
            Inventory
          </NavLink>
        </nav>
        {user && (
          <>
            <span className="user-chip">
              {user.full_name} · {user.role.replace("_", " ")}
            </span>
            <button className="logout-btn" onClick={logout}>
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
