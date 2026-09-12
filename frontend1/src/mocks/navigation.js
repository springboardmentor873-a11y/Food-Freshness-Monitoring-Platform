import {
  ScanLine,
  Boxes,
  BarChart3,
  FileText,
  Bell,
  Settings,
  ShieldCheck,
  History,
  User,
  Users,
  Activity,
  Cpu,
  LayoutDashboard,
} from "lucide-react";

export const USER_NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { name: "Analyze Food", path: "/app/analyze", icon: ScanLine },
      { name: "Prediction History", path: "/app/analyze/results/recent", icon: History },
      { name: "Inventory", path: "/app/inventory", icon: Boxes },
    ],
  },
  {
    label: "Insights",
    items: [
      { name: "Analytics", path: "/app/analytics", icon: BarChart3 },
      { name: "Reports", path: "/app/reports", icon: FileText },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Notifications", path: "/app/notifications", icon: Bell, badge: 3 },
      { name: "Profile", path: "/app/settings?tab=profile", icon: User },
      { name: "Settings", path: "/app/settings", icon: Settings },
    ],
  },
];

export const ADMIN_NAV_GROUPS = [
  {
    label: "Admin Console",
    items: [
      { name: "Admin Dashboard", path: "/admin-dashboard", icon: ShieldCheck },
      { name: "User Management", path: "/admin-dashboard", icon: Users },
      { name: "User Login Activity", path: "/admin-dashboard", icon: History },
      { name: "Food Analysis Management", path: "/admin-dashboard", icon: Activity },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Analytics & Reports", path: "/app/analytics", icon: BarChart3 },
      { name: "System Status", path: "/admin-dashboard", icon: Cpu },
      { name: "Notifications & Alerts", path: "/app/notifications", icon: Bell, badge: 3 },
    ],
  },
  {
    label: "Switch View",
    items: [
      { name: "User View", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
];


// Fallback for general navigation
export const NAV_GROUPS = USER_NAV_GROUPS;
