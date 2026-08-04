import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  ScanSearch,
  Boxes,
  BarChart3,
  FileText,
  Bell,
  User,
  Shield,
  History,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  {
    name: "Prediction History",
    path: "/prediction-history",
    icon: History,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Food Detection",
    path: "/food-detection",
    icon: ScanSearch,
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: Boxes,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    name: "Admin",
    path: "/admin",
    icon: Shield,
    roles: ["admin", "administrator"],
  },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = (user?.role || "consumer").toLowerCase();

  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.map((r) => r.toLowerCase()).includes(userRole);
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="border-b border-slate-200 px-7 py-7">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 shadow-md">

            <ShieldCheck
              size={28}
              className="text-white"
            />

          </div>

          <div>

            <h1 className="text-3xl font-extrabold tracking-tight text-green-600">
              AI Food Freshness
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitoring System
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-6">

        {visibleMenuItems.map((item) => {

          const Icon = item.icon;


          return (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                group mb-2 flex items-center gap-4 rounded-2xl px-5 py-4
                font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-green-600 hover:translate-x-1"
                }
                `
              }
            >

              <Icon
                size={21}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              <span>{item.name}</span>

            </NavLink>

          );
        })}

      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-5">

        <button
          onClick={handleLogout}
          className="
          flex w-full items-center gap-4 rounded-2xl
          px-5 py-4 font-medium text-red-500
          transition-all duration-300
          hover:bg-red-50 hover:translate-x-1
          "
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
