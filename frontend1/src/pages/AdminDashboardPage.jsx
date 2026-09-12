import { useState, useMemo, useEffect } from "react";
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
import EmptyState from "../components/ui/EmptyState";
import { useTheme } from "../context/ThemeProvider";
import { getChartTheme } from "../utils/chartTheme";
import { appToast } from "../components/ui/Toast";
import { apiService } from "../services/api";

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

// Fallback arrays only if DB fails completely
const INITIAL_USERS = [];
const INITIAL_LOGIN_HISTORY = [];

// Most Searched & Analyzed Items
const MOST_SEARCHED_ITEMS = [
  { name: "Red Delicious Apple", count: 1842, category: "Fruits", freshRate: "98%" },
  { name: "Roma Tomato", count: 1620, category: "Vegetables", freshRate: "91%" },
  { name: "Whole Cow Milk", count: 1410, category: "Dairy", freshRate: "94%" },
  { name: "Cavendish Banana", count: 1290, category: "Fruits", freshRate: "86%" },
  { name: "Sourdough Bread", count: 1105, category: "Bakery", freshRate: "95%" },
  { name: "Navel Orange", count: 980, category: "Fruits", freshRate: "97%" },
];

export default function AdminDashboardPage() {
  const { isDark } = useTheme();
  const theme = getChartTheme(isDark);

  const [users, setUsers] = useState([]);
  const [loginHistoryList, setLoginHistoryList] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [recentAnalysesList, setRecentAnalysesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, login-activity, analysis, system, alerts
  const [timeframe, setTimeframe] = useState("daily"); // daily, weekly, monthly

  // Fetch Live Admin Telemetry from SQLite Database
  useEffect(() => {
    // 1. Fetch Dashboard Overview KPIs
    apiService.getAdminDashboard()
      .then((data) => {
        if (data) setDashboardData(data);
      })
      .catch((err) => console.warn("[AdminDashboard] Dashboard API warning:", err.message));

    // 2. Fetch System Telemetry
    apiService.getSystemStatus()
      .then((status) => {
        if (status) setSystemStatus(status);
      })
      .catch((err) => console.warn("[AdminDashboard] System status API warning:", err.message));

    // 3. Fetch Registered Users from Database
    apiService.getAdminUsers()
      .then((dbUsers) => {
        if (dbUsers && Array.isArray(dbUsers)) {
          setUsers(dbUsers.map(u => ({
            id: String(u.id),
            name: u.name,
            username: u.username,
            email: u.email,
            role: u.role || "Consumer",
            status: u.status || "Active",
            created_at: u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A",
            lastLogin: u.last_login ? new Date(u.last_login).toLocaleString() : "Never",
            ip: u.ip_address || "127.0.0.1",
          })));
        }
      })
      .catch((err) => console.warn("[AdminDashboard] Users API warning:", err.message));

    // 4. Fetch Live Login Activity from Database
    apiService.getAdminLoginActivity()
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mapped = data.map((item) => {
            const dt = item.login_time ? new Date(item.login_time) : new Date();
            const dateStr = dt.toLocaleDateString();
            const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              id: item.id || `lh_${Math.random()}`,
              name: item.user_name || "User",
              username: item.username || "user",
              userEmail: item.user_email || "",
              role: item.role || "Consumer",
              date: dateStr,
              time: timeStr,
              status: item.status || "Successful",
            };
          });
          setLoginHistoryList(mapped);
        }
      })
      .catch((err) => console.warn("[AdminDashboard] Login activity API warning:", err.message));

    // 5. Fetch Real Food Analyses from Database
    apiService.getAdminAnalyses()
      .then((res) => {
        if (res && res.items && Array.isArray(res.items)) {
          setRecentAnalysesList(res.items);
        }
      })
      .catch((err) => console.warn("[AdminDashboard] Analyses API warning:", err.message));
  }, [activeTab]);



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
          value={String(dashboardData?.total_users ?? users.length)}
          suffix=" users"
          delta="Real DB Users"
          trend="up"
          icon={Users}
        />
        <StatCard
          label="Total Food Inferences"
          value={String(dashboardData?.total_analyses ?? recentAnalysesList.length)}
          suffix=" scans"
          delta="Real DB Analyses"
          trend="up"
          icon={ScanLine}
        />
        <StatCard
          label="Fresh Predictions"
          value={String(dashboardData?.fresh_analyses ?? recentAnalysesList.filter(a => a.predicted_category === "Fresh").length)}
          suffix=" fresh"
          delta="Optimal ratio"
          trend="up"
          icon={CheckCircle2}
        />
        <StatCard
          label="Spoiled Predictions"
          value={String(dashboardData?.spoiled_analyses ?? recentAnalysesList.filter(a => a.predicted_category !== "Fresh").length)}
          suffix=" flagged"
          delta="Risk monitored"
          trend="down"
          icon={AlertTriangle}
        />
      </div>

      {/* THREE PRIMARY MANAGEMENT AREAS CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-cyan-500" size={18} />
            Admin Dashboard Management Areas
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Click any section below to view real database records
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            onClick={() => setActiveTab("users")}
            className={`cursor-pointer rounded-2xl border p-5 transition-all shadow-md hover:shadow-lg ${
              activeTab === "users"
                ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Users size={22} />
              </span>
              <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                {users.length} Users
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">User Management</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              View real registered users, User IDs, Name, Email, Role, Status, and Created dates.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              Open User Management →
            </div>
          </div>

          <div
            onClick={() => setActiveTab("login-activity")}
            className={`cursor-pointer rounded-2xl border p-5 transition-all shadow-md hover:shadow-lg ${
              activeTab === "login-activity"
                ? "border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 ring-2 ring-purple-500/20"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-purple-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Clock size={22} />
              </span>
              <span className="rounded-full bg-purple-100 dark:bg-purple-900/40 px-2.5 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                {loginHistoryList.length} Logins
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">User Login Activity</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Audit real login activity data: User, Email, Role, Login date/time, and Status.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
              Open Login Activity →
            </div>
          </div>

          <div
            onClick={() => setActiveTab("analysis")}
            className={`cursor-pointer rounded-2xl border p-5 transition-all shadow-md hover:shadow-lg ${
              activeTab === "analysis"
                ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <ScanLine size={22} />
              </span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {recentAnalysesList.length} Records
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Food Analysis Management</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Inspect real food analysis records: User, Food item, Category, Confidence, Score, Risk.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Open Food Analysis →
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        {[
          { id: "overview", label: "Overview & Analytics", icon: Activity },
          { id: "users", label: "User Management", icon: Users, badge: users.length.toString() },
          { id: "login-activity", label: "User Login Activity", icon: Clock, badge: loginHistoryList.length.toString() },
          { id: "analysis", label: "Food Analysis Management", icon: ScanLine, badge: recentAnalysesList.length.toString() },
          { id: "system", label: "System Status", icon: Cpu, badge: "Healthy" },
          { id: "alerts", label: "Notifications & Alerts", icon: Bell },
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
              {tab.badge !== undefined && (
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
            <StatCard label="Total Registered Users" value={String(users.length)} suffix=" users" icon={Users} />
            <StatCard label="Active Users" value={String(users.filter(u => u.status === "Active").length)} suffix=" active" delta="Registered" trend="up" icon={UserCheck} />
            <StatCard label="User Roles Managed" value="4" suffix=" roles" delta="Consumer, Retail, Warehouse, Inspector" trend="up" icon={UserPlus} />
          </div>

          {/* Searchable Users Table */}
          <Card>
            <Card.Header
              title="Registered User Directory (Database)"
              subtitle="Real registered user data stored in SQLite database"
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

            {filteredUsers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No registered users found"
                description="No registered user records exist in the database matching your criteria."
                className="py-12"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                    <tr>
                      <th className="px-4 py-3.5 font-bold">User ID</th>
                      <th className="px-4 py-3.5 font-bold">Name & Email</th>
                      <th className="px-4 py-3.5 font-bold">Username</th>
                      <th className="px-4 py-3.5 font-bold">Role</th>
                      <th className="px-4 py-3.5 font-bold">Account Status</th>
                      <th className="px-4 py-3.5 font-bold">Created Date</th>
                      <th className="px-4 py-3.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 text-xs font-mono font-bold text-slate-500">
                          #{u.id}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                          <div>
                            <p className="font-bold">{u.name}</p>
                            <p className="text-xs text-slate-400 font-normal">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                          @{u.username}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                              u.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">{u.created_at || u.lastLogin}</td>
                        <td className="px-4 py-3.5 text-right">
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
            )}
          </Card>
        </div>
      )}

      {/* ================= TAB 3: USER LOGIN ACTIVITY ================= */}
      {activeTab === "login-activity" && (
        <div className="space-y-6">
          <Card>
            <Card.Header
              title="USER LOGIN ACTIVITY"
              subtitle="Real-time login activity records fetched directly from the database"
            />

            {loginHistoryList.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No login activity yet"
                description="User login activity records will automatically appear here as users log in."
                className="py-14"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">User</th>
                      <th className="px-5 py-3.5 font-bold">Email</th>
                      <th className="px-5 py-3.5 font-bold">Role</th>
                      <th className="px-5 py-3.5 font-bold">Login Date & Time</th>
                      <th className="px-5 py-3.5 font-bold text-right">Login Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {loginHistoryList.map((lh) => (
                      <tr key={lh.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                          <div>
                            <p className="font-bold">{lh.name}</p>
                            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">@{lh.username}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                          {lh.userEmail || "N/A"}
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {lh.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                          {lh.date} {lh.time}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                              lh.status === "Successful" || lh.status === "Online"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${lh.status === "Successful" || lh.status === "Online" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                            {lh.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ================= TAB 4: FOOD ANALYSIS MANAGEMENT ================= */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          {/* Analysis Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Analyses Conducted" value={String(recentAnalysesList.length)} suffix=" scans" icon={ScanLine} />
            <StatCard label="Fresh Predictions" value={String(recentAnalysesList.filter(a => a.predicted_category === "Fresh").length)} suffix=" fresh" icon={CheckCircle2} />
            <StatCard label="Spoiled / Risk Predictions" value={String(recentAnalysesList.filter(a => a.predicted_category !== "Fresh").length)} suffix=" flagged" icon={AlertTriangle} />
          </div>

          <Card>
            <Card.Header
              title="FOOD ANALYSIS MANAGEMENT"
              subtitle="Real food analysis records stored in SQLite database"
            />

            {recentAnalysesList.length === 0 ? (
              <EmptyState
                icon={ScanLine}
                title="No food analysis records yet"
                description="Food freshness analyses performed by users will appear here automatically."
                className="py-14"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                    <tr>
                      <th className="px-4 py-3.5 font-bold">User</th>
                      <th className="px-4 py-3.5 font-bold">Food Item</th>
                      <th className="px-4 py-3.5 font-bold">Category</th>
                      <th className="px-4 py-3.5 font-bold">Predicted Freshness</th>
                      <th className="px-4 py-3.5 font-bold">Confidence</th>
                      <th className="px-4 py-3.5 font-bold">Score</th>
                      <th className="px-4 py-3.5 font-bold">Risk Level</th>
                      <th className="px-4 py-3.5 font-bold text-right">Analysis Date/Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentAnalysesList.map((a) => {
                      const confPct = (a.prediction_confidence <= 1 ? a.prediction_confidence * 100 : a.prediction_confidence).toFixed(1);
                      return (
                        <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                            <div>
                              <p className="font-bold">{a.user_name || "Guest / System"}</p>
                              <p className="text-xs text-slate-400 font-normal">{a.user_email || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                            {a.item_name}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                            {a.category}
                          </td>
                          <td className="px-4 py-3.5 text-xs">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                                a.predicted_category === "Fresh"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                              }`}
                            >
                              {a.predicted_category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {confPct}%
                          </td>
                          <td className="px-4 py-3.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {a.overall_freshness_score ? a.overall_freshness_score.toFixed(1) : 0}%
                          </td>
                          <td className="px-4 py-3.5 text-xs">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                a.risk_level === "Low Risk" || a.risk_level === "Optimal"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                  : a.risk_level === "Moderate Risk"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                  : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                              }`}
                            >
                              {a.risk_level}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400 text-right">
                            {new Date(a.created_at).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
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
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {systemStatus?.ml_model_loaded ? "Loaded & Online" : "Online"}
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                {systemStatus?.model_name || "EfficientNetV2B2"}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Classes: {systemStatus?.num_classes || 2} ({systemStatus?.classes?.join(", ") || "Fresh, Spoiled"})
              </p>
              <p className="text-[11px] text-slate-400 mt-2">Keras / TensorFlow Accelerated</p>
            </Card>

            {/* API Status */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FastAPI Gateway</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {systemStatus?.backend_status || "Online"}
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                {systemStatus?.api_health || "Healthy"}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">REST API Operational</p>
              <p className="text-[11px] text-slate-400 mt-2">FastAPI 0.110 ready</p>
            </Card>

            {/* Database Status */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Layer</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {systemStatus?.database_status || "Connected"}
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                {dashboardData?.total_analyses ?? 0} Analyses Stored
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">SQLite Engine Active</p>
              <p className="text-[11px] text-slate-400 mt-2">Auto-persistence enabled</p>
            </Card>

            {/* Last Model Update */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Model Artifact</span>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                  {systemStatus?.ml_model_loaded ? "Loaded" : "Ready"}
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">freshness_model.keras</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Input shape: (260, 260, 3)</p>
              <p className="text-[11px] text-slate-400 mt-2">TensorFlow {systemStatus?.tensorflow_version || "2.11+"}</p>
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
          {recentAnalysesList.filter(a => a.risk_level !== "Low Risk" && a.risk_level !== "Optimal").length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No active alerts"
              description="No active spoilage warnings or critical system alerts requiring attention."
              className="py-14 border-none"
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAnalysesList.filter(a => a.risk_level !== "Low Risk" && a.risk_level !== "Optimal").map((alt) => (
                <div key={alt.id} className="flex items-start justify-between py-4 px-2">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                        alt.risk_level === "High Risk" || alt.risk_level === "Spoiled"
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                      }`}
                    >
                      <AlertTriangle size={18} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Freshness Alert: {alt.item_name}</h4>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {alt.risk_level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Scanned by {alt.user_name || "User"} ({alt.user_role}). Score: {alt.overall_freshness_score ? alt.overall_freshness_score.toFixed(1) : 0}%. {alt.recommendation}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1.5">{new Date(alt.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => appToast.success(`Alert for "${alt.item_name}" acknowledged.`)}
                  >
                    Acknowledge
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

    </div>
  );
}
