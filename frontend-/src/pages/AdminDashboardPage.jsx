import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Users,
  UserCheck,
  UserPlus,
  Activity,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  Cpu,
  Server,
  Database,
  Clock,
  ShieldCheck,
  RefreshCw,
  Bell,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Eye,
} from "lucide-react";
import StatCard from "../components/shared/StatCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useTheme } from "../context/ThemeProvider";
import { getChartTheme } from "../utils/chartTheme";
import { appToast } from "../components/ui/Toast";

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// Mock Users Dataset
const INITIAL_USERS = [
  { id: "usr_101", name: "Aarav Sharma", username: "aarav_s", email: "aarav.sharma@freshai.dev", role: "Retail Manager", status: "Active", lastLogin: "10 mins ago", ip: "192.168.1.42", device: "Chrome / Windows" },
  { id: "usr_102", name: "Priya Patel", username: "priya_p", email: "priya.patel@freshai.dev", role: "Warehouse Operator", status: "Active", lastLogin: "25 mins ago", ip: "192.168.1.88", device: "Safari / macOS" },
  { id: "usr_103", name: "Rohan Verma", username: "rohan_v", email: "rohan.verma@freshai.dev", role: "Food Inspector", status: "Offline", lastLogin: "2 hours ago", ip: "192.168.2.14", device: "Firefox / Linux" },
  { id: "usr_104", name: "Ananya Iyer", username: "ananya_i", email: "ananya.iyer@freshai.dev", role: "Consumer", status: "Active", lastLogin: " Just now", ip: "192.168.1.105", device: "Safari / iOS" },
  { id: "usr_105", name: "Vikram Singh", username: "vikram_s", email: "vikram.singh@freshai.dev", role: "Administrator", status: "Active", lastLogin: "Active Now", ip: "192.168.1.1", device: "Chrome / Windows" },
  { id: "usr_106", name: "Meera Reddy", username: "meera_r", email: "meera.reddy@freshai.dev", role: "Retail Manager", status: "Suspended", lastLogin: "3 days ago", ip: "192.168.3.22", device: "Edge / Windows" },
  { id: "usr_107", name: "Karan Gupta", username: "karan_g", email: "karan.gupta@freshai.dev", role: "Consumer", status: "Offline", lastLogin: "Yesterday", ip: "192.168.1.200", device: "Chrome / Android" },
];

// Mock User Login History
const LOGIN_HISTORY = [
  { id: "lh_1", user: "aarav_s", name: "Aarav Sharma", timestamp: "Today, 10:45 AM", ip: "192.168.1.42", device: "Chrome on Windows", status: "Successful" },
  { id: "lh_2", user: "priya_p", name: "Priya Patel", timestamp: "Today, 10:30 AM", ip: "192.168.1.88", device: "Safari on macOS", status: "Successful" },
  { id: "lh_3", user: "ananya_i", name: "Ananya Iyer", timestamp: "Today, 10:15 AM", ip: "192.168.1.105", device: "Mobile Safari", status: "Successful" },
  { id: "lh_4", user: "unknown_user", name: "Unrecognized", timestamp: "Today, 09:12 AM", ip: "45.12.89.201", device: "Postman API Client", status: "Failed Attempt" },
  { id: "lh_5", user: "rohan_v", name: "Rohan Verma", timestamp: "Today, 08:40 AM", ip: "192.168.2.14", device: "Firefox on Linux", status: "Successful" },
];

// Most Searched & Analyzed Items
const MOST_SEARCHED_ITEMS = [
  { name: "Red Delicious Apple", count: 1842, category: "Fruits", freshRate: "98%" },
  { name: "Roma Tomato", count: 1620, category: "Vegetables", freshRate: "91%" },
  { name: "Whole Cow Milk", count: 1410, category: "Dairy", freshRate: "94%" },
  { name: "Cavendish Banana", count: 1290, category: "Fruits", freshRate: "86%" },
  { name: "Sourdough Bread", count: 1105, category: "Bakery", freshRate: "95%" },
  { name: "Navel Orange", count: 980, category: "Fruits", freshRate: "97%" },
];

// Recent Prediction Stream
const RECENT_PREDICTIONS = [
  { id: "pred_01", item: "Organic Strawberries", batch: "ST-882", user: "priya_p", result: "Fresh", confidence: "98.4%", shelfLife: "6 Days Left", time: "2 mins ago" },
  { id: "pred_02", item: "Full Cream Milk", batch: "MK-304", user: "aarav_s", result: "Spoiled", confidence: "96.1%", shelfLife: "Expired", time: "8 mins ago" },
  { id: "pred_03", item: "Hass Avocado", batch: "AV-112", user: "ananya_i", result: "Near Spoilage", confidence: "92.5%", shelfLife: "1 Day Left", time: "14 mins ago" },
  { id: "pred_04", item: "Fresh Spinach", batch: "SP-901", user: "rohan_v", result: "Fresh", confidence: "99.1%", shelfLife: "5 Days Left", time: "22 mins ago" },
  { id: "pred_05", item: "Chicken Breast", batch: "CB-554", user: "aarav_s", result: "Fresh", confidence: "97.8%", shelfLife: "4 Days Left", time: "35 mins ago" },
];

// Notifications & System Alerts
const SYSTEM_ALERTS = [
  { id: "alt_1", type: "Spoilage Alert", title: "Batch #MK-304 Spoilage Warning", desc: "Full Cream Milk batch flagged as Spoiled by EfficientNetB0.", severity: "high", time: "8 mins ago" },
  { id: "alt_2", type: "System Alert", title: "API Gateway Peak Load", desc: "Inference rate spiked to 140 req/min; latency remains optimal (42ms).", severity: "info", time: "18 mins ago" },
  { id: "alt_3", type: "Shelf-Life Alert", title: "Cold Storage Unit #2 Variance", desc: "Temperature reached 4.2°C (Target: 1-4°C). Recommended check.", severity: "medium", time: "45 mins ago" },
  { id: "alt_4", type: "Spoilage Alert", title: "Avocado Batch #AV-112 Near Expiry", desc: "Item marked near spoilage — automatically scheduled for markdown.", severity: "medium", time: "1 hour ago" },
];

export default function AdminDashboardPage() {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, analysis, analytics, system, alerts
  const [timeframe, setTimeframe] = useState("daily"); // daily, weekly, monthly

  // User Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Toggle user status
  const handleToggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "Active" ? "Suspended" : "Active";
          appToast.success(`User @${u.username} status updated to ${nextStatus}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = "ID,Name,Username,Email,Role,Status,Last Login,IP Address\n";
    const rows = users
      .map((u) => `"${u.id}","${u.name}","${u.username}","${u.email}","${u.role}","${u.status}","${u.lastLogin}","${u.ip}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `food_freshness_users_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    appToast.success("Exported Users & Analytics CSV successfully!");
  };

  // PDF Export simulation
  const handleExportPDF = () => {
    window.print();
    appToast.success("PDF Export dialog triggered.");
  };

  const handleDownloadReport = () => {
    appToast.success("Analytics summary report generated and downloaded.");
  };

  // ================= CHART CONFIGURATIONS =================

  // 1. Daily Prediction Chart Data
  const dailyChartData = useMemo(() => ({
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
    datasets: [
      {
        label: "Predictions Today",
        data: [120, 45, 380, 890, 1120, 940, 395],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#10B981",
      },
    ],
  }), []);

  // 2. Weekly Prediction Chart Data
  const weeklyChartData = useMemo(() => ({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Fresh Predictions",
        data: [1420, 1580, 1690, 1840, 1920, 1310, 1060],
        backgroundColor: "#10B981",
        borderRadius: 8,
      },
      {
        label: "Spoiled Predictions",
        data: [180, 210, 195, 230, 260, 310, 245],
        backgroundColor: "#F43F5E",
        borderRadius: 8,
      },
    ],
  }), []);

  // 3. Monthly Prediction Chart Data
  const monthlyChartData = useMemo(() => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Total Monthly Scans",
        data: [8400, 9200, 10500, 11200, 12800, 13900, 14800, 15600, 16200, 17400, 18100, 19500],
        borderColor: "#14B8A6",
        backgroundColor: "rgba(20, 184, 166, 0.12)",
        fill: true,
        tension: 0.35,
        borderWidth: 3,
      },
    ],
  }), []);

  // 4. User Growth Chart Data
  const userGrowthData = useMemo(() => ({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Active Registered Users",
        data: [420, 610, 780, 940, 1120, 1248],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
      },
    ],
  }), []);

  // 5. Category Distribution Chart Data
  const categoryDistributionData = useMemo(() => ({
    labels: ["Fruits", "Vegetables", "Dairy", "Bakery", "Meat & Seafood"],
    datasets: [
      {
        data: [4850, 3920, 2100, 1580, 1200],
        backgroundColor: ["#10B981", "#14B8A6", "#3B82F6", "#F59E0B", "#EC4899"],
        borderColor: isDark ? "#0F172A" : "#FFFFFF",
        borderWidth: 3,
      },
    ],
  }), [isDark]);

  const lineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top", labels: { color: theme.textColor, font: { size: 12 } } },
      tooltip: { backgroundColor: theme.tooltipBg, titleColor: theme.tooltipText, bodyColor: theme.tooltipText, padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: theme.textColor } },
      y: { grid: { color: theme.gridColor }, ticks: { color: theme.textColor } },
    },
  }), [theme]);

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top", labels: { color: theme.textColor } },
      tooltip: { backgroundColor: theme.tooltipBg, titleColor: theme.tooltipText, bodyColor: theme.tooltipText },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: theme.textColor } },
      y: { grid: { color: theme.gridColor }, ticks: { color: theme.textColor } },
    },
  }), [theme]);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: true, position: "right", labels: { color: theme.textColor, font: { size: 12 } } },
      tooltip: { backgroundColor: theme.tooltipBg, titleColor: theme.tooltipText, bodyColor: theme.tooltipText },
    },
  }), [theme]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={18} />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Admin Platform Console
            </h1>
            <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              Super Admin Access
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Real-time governance, AI model telemetry, user management, and prediction analytics.
          </p>
        </div>

        {/* Export & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<FileSpreadsheet size={15} />}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPDF}
            leftIcon={<FileText size={15} />}
          >
            Export PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadReport}
            leftIcon={<Download size={15} />}
          >
            Analytics Report
          </Button>
        </div>
      </div>

      {/* Top Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Registered Users"
          value="1,248"
          suffix=" users"
          delta="+34 today"
          trend="up"
          icon={Users}
        />
        <StatCard
          label="Total Food Inferences"
          value="12,450"
          suffix=" scans"
          delta="+18% vs avg"
          trend="up"
          icon={ScanLine}
        />
        <StatCard
          label="Fresh Predictions"
          value="10,820"
          suffix=" (86.9%)"
          delta="Normal ratio"
          trend="up"
          icon={CheckCircle2}
        />
        <StatCard
          label="Spoiled Predictions"
          value="1,630"
          suffix=" (13.1%)"
          delta="-2.4% spoilage"
          trend="down"
          icon={AlertTriangle}
        />
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        {[
          { id: "overview", label: "Overview & Analytics", icon: Activity },
          { id: "users", label: "User Management", icon: Users, badge: "1,248" },
          { id: "analysis", label: "Food Analysis Stats", icon: ScanLine },
          { id: "system", label: "System Status", icon: Cpu, badge: "Healthy" },
          { id: "alerts", label: "Notifications & Alerts", icon: Bell, badge: "4" },
        ].map((tab) => {
          const IconC = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-gradient-brand text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <IconC size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Main Chart Section with Timeframe Selector */}
          <Card>
            <Card.Header
              title="Food Prediction Trends & Volume"
              subtitle="Real-time food classification throughput over selected timeframe"
              action={
                <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  {["daily", "weekly", "monthly"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        timeframe === tf
                          ? "bg-white text-emerald-600 shadow-xs dark:bg-slate-900 dark:text-emerald-400"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              }
            />

            <div className="h-72 w-full pt-2">
              {timeframe === "daily" && <Line data={dailyChartData} options={lineOptions} />}
              {timeframe === "weekly" && <Bar data={weeklyChartData} options={barOptions} />}
              {timeframe === "monthly" && <Line data={monthlyChartData} options={lineOptions} />}
            </div>
          </Card>

          {/* Secondary Analytics Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* User Growth Chart */}
            <Card>
              <Card.Header
                title="User Platform Growth"
                subtitle="Weekly registered active users trajectory"
              />
              <div className="h-64 w-full pt-2">
                <Line data={userGrowthData} options={lineOptions} />
              </div>
            </Card>

            {/* Category Distribution Chart */}
            <Card>
              <Card.Header
                title="Analyzed Food Category Distribution"
                subtitle="Percentage breakdown by produce category"
              />
              <div className="h-64 w-full pt-2">
                <Doughnut data={categoryDistributionData} options={doughnutOptions} />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB 2: USER MANAGEMENT ================= */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* User Management Stat Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Platform Users" value="1,248" suffix=" users" icon={Users} />
            <StatCard label="Active Users Now" value="1,180" suffix=" active" delta="94.5% online rate" trend="up" icon={UserCheck} />
            <StatCard label="New Registrations Today" value="34" suffix=" new" delta="+12 vs yesterday" trend="up" icon={UserPlus} />
          </div>

          {/* Searchable Users Table */}
          <Card>
            <Card.Header
              title="User Account Directory & Privilege Controls"
              subtitle="Search, view status, and manage user privileges across the platform"
              action={
                <div className="w-64">
                  <Input
                    placeholder="Search users by name, email, role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={16} />}
                  />
                </div>
              }
            />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User Details</th>
                    <th className="px-4 py-3 font-semibold">Username</th>
                    <th className="px-4 py-3 font-semibold">Assigned Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Last Login</th>
                    <th className="px-4 py-3 font-semibold">IP Address</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        <div>
                          <p className="font-bold">{u.name}</p>
                          <p className="text-xs text-slate-400 font-normal">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                        @{u.username}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            u.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : u.status === "Offline"
                              ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500 animate-pulse" : u.status === "Offline" ? "bg-slate-400" : "bg-rose-500"}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{u.lastLogin}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{u.ip}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant={u.status === "Active" ? "secondary" : "outlineBrand"}
                          onClick={() => handleToggleUserStatus(u.id)}
                        >
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* User Login Audit History Table */}
          <Card>
            <Card.Header
              title="Recent User Authentication & Login History"
              subtitle="Real-time access logs and device details"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Timestamp</th>
                    <th className="px-4 py-3 font-semibold">Client IP</th>
                    <th className="px-4 py-3 font-semibold">Device & Browser</th>
                    <th className="px-4 py-3 font-semibold text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {LOGIN_HISTORY.map((lh) => (
                    <tr key={lh.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        <span>{lh.name}</span>
                        <span className="block text-xs font-mono text-slate-400">@{lh.user}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{lh.timestamp}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{lh.ip}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{lh.device}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            lh.status === "Successful"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {lh.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ================= TAB 3: FOOD ANALYSIS MANAGEMENT ================= */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          {/* Analysis Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Analyses Conducted" value="12,450" suffix=" scans" icon={ScanLine} />
            <StatCard label="Fresh Predictions" value="10,820" suffix=" (86.9%)" icon={CheckCircle2} />
            <StatCard label="Spoiled Predictions" value="1,630" suffix=" (13.1%)" icon={AlertTriangle} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Most Searched Food Items */}
            <Card>
              <Card.Header
                title="Most Searched & Analyzed Food Items"
                subtitle="Top produce items scanned by users"
              />
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOST_SEARCHED_ITEMS.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">Category: {item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">{item.count} scans</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Fresh Rate: {item.freshRate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Prediction Stream */}
            <Card>
              <Card.Header
                title="Live Prediction Activity Stream"
                subtitle="Real-time model inferences across user sessions"
              />
              <div className="space-y-3">
                {RECENT_PREDICTIONS.map((pred) => (
                  <div
                    key={pred.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{pred.item}</span>
                        <span className="text-xs font-mono text-slate-400">({pred.batch})</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Scanned by <span className="font-semibold text-slate-700 dark:text-slate-200">@{pred.user}</span> · {pred.time}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          pred.result === "Fresh"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : pred.result === "Near Spoilage"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}
                      >
                        {pred.result} ({pred.confidence})
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{pred.shelfLife}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SYSTEM STATUS ================= */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* AI Model Status */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Model Engine</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Online</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">EfficientNetB0</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Accuracy: 96.8% (v2.4)</p>
              <p className="text-[11px] text-slate-400 mt-2">PyTorch GPU Accelerated</p>
            </Card>

            {/* API Status */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FastAPI Gateway</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Operational</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">42 ms Latency</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Uptime: 99.98%</p>
              <p className="text-[11px] text-slate-400 mt-2">REST / FastAPI 0.110 ready</p>
            </Card>

            {/* Database Status */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Layer</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Connected</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">12.4K Records</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Status: Healthy</p>
              <p className="text-[11px] text-slate-400 mt-2">Auto-backup enabled</p>
            </Card>

            {/* Last Model Update */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Training</span>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">Updated</span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">2 Hours Ago</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Epoch 50 Completed</p>
              <p className="text-[11px] text-slate-400 mt-2">Loss: 0.042 (Converged)</p>
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB 5: NOTIFICATIONS & ALERTS ================= */}
      {activeTab === "alerts" && (
        <Card>
          <Card.Header
            title="Platform Spoilage & System Notifications Center"
            subtitle="Categorized real-time alerts requiring administrative action"
          />
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {SYSTEM_ALERTS.map((alt) => (
              <div key={alt.id} className="flex items-start justify-between py-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                      alt.severity === "high"
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                        : alt.severity === "medium"
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    }`}
                  >
                    {alt.severity === "high" ? (
                      <AlertTriangle size={18} />
                    ) : alt.severity === "medium" ? (
                      <Flame size={18} />
                    ) : (
                      <Bell size={18} />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{alt.title}</h4>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {alt.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{alt.desc}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5">{alt.time}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => appToast.success(`Alert "${alt.title}" acknowledged.`)}
                >
                  Acknowledge
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
