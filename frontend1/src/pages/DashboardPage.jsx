import { useAuth, ROLES } from "../context/AuthContext";
import { Boxes, Gauge, AlertTriangle, Leaf, ArrowRight, ScanLine, Thermometer, ShieldCheck, Activity, UserCheck, Layers, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/shared/StatCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import FreshnessTrendChart from "../components/charts/FreshnessTrendChart";
import { RECENT_ACTIVITY, STATUS_COLORS } from "../mocks/dashboardStats";

export default function DashboardPage() {
  const { user, role } = useAuth();

  // Role-based stat cards configuration
  const getRoleStats = () => {
    switch (role) {
      case ROLES.CONSUMER:
        return [
          { label: "Tracked Food Items", value: "18", suffix: " items", icon: Boxes, delta: "+3 this week", trend: "up" },
          { label: "Pantry Freshness", value: "88.5", suffix: "%", icon: Gauge, delta: "+2.1%", trend: "up" },
          { label: "Items Near Expiry", value: "2", suffix: " items", icon: AlertTriangle, delta: "-1 from yesterday", trend: "down" },
          { label: "Food Waste Avoided", value: "4.2", suffix: " kg", icon: Leaf, delta: "Saved $34.50", trend: "up" },
        ];
      case ROLES.WAREHOUSE_OPERATOR:
        return [
          { label: "Warehouse Batches", value: "142", suffix: " batches", icon: Layers, delta: "+12 checked", trend: "up" },
          { label: "Cold Storage Temp", value: "2.4", suffix: " °C", icon: Thermometer, delta: "Compliant (1-4°C)", trend: "up" },
          { label: "Ambient Humidity", value: "84", suffix: " %", icon: Activity, delta: "Optimal range", trend: "up" },
          { label: "Storage Compliance", value: "98.2", suffix: " %", icon: ShieldCheck, delta: "99.1% target", trend: "up" },
        ];
      case ROLES.FOOD_INSPECTOR:
        return [
          { label: "Inspections Conducted", value: "54", suffix: " items", icon: UserCheck, delta: "+8 today", trend: "up" },
          { label: "Spoilage Rate", value: "1.8", suffix: " %", icon: AlertTriangle, delta: "-0.4%", trend: "down" },
          { label: "Quality Pass Rate", value: "96.4", suffix: " %", icon: ShieldCheck, delta: "+1.2%", trend: "up" },
          { label: "Safety Score", value: "94", suffix: " /100", icon: Gauge, delta: "Grade A", trend: "up" },
        ];
      case ROLES.ADMINISTRATOR:
        return [
          { label: "Active Platform Users", value: "1,248", suffix: " users", icon: Boxes, delta: "+14% this month", trend: "up" },
          { label: "API Response Time", value: "42", suffix: " ms", icon: Cpu, delta: "99.98% uptime", trend: "up" },
          { label: "Model Accuracy", value: "96.8", suffix: " %", icon: Gauge, delta: "EfficientNetV2B2", trend: "up" },
          { label: "Daily Predictions", value: "3,890", suffix: " scans", icon: ScanLine, delta: "+18%", trend: "up" },
        ];
      case ROLES.RETAIL_MANAGER:
      default:
        return [
          { label: "Total Inventory", value: "328", suffix: " items", icon: Boxes, delta: "+14 this week", trend: "up" },
          { label: "Avg Freshness Score", value: "84.2", suffix: " %", icon: Gauge, delta: "+3.1%", trend: "up" },
          { label: "Items At-Risk", value: "12", suffix: " items", icon: AlertTriangle, delta: "-4 from yesterday", trend: "down" },
          { label: "Monthly Waste Saved", value: "184", suffix: " kg", icon: Leaf, delta: "+12.4%", trend: "up" },
        ];
    }
  };

  const roleStats = getRoleStats();

  return (
    <div className="space-y-6">
      {/* Header with active role badge */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {(user?.name || user?.username || "User").split(" ")[0]}
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {role} View
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {role === ROLES.CONSUMER && "Monitor your household food freshness, shelf life, and optimal storage recommendations."}
            {role === ROLES.RETAIL_MANAGER && "Manage store inventory freshness, shelf-life alerts, and FEFO inventory rotation."}
            {role === ROLES.WAREHOUSE_OPERATOR && "Track cold storage environmental sensors, humidity compliance, and bulk batch health."}
            {role === ROLES.FOOD_INSPECTOR && "Audit food quality metrics, spoilage detection accuracy, and compliance inspection logs."}
            {role === ROLES.ADMINISTRATOR && "Oversee platform performance metrics, AI model accuracy, API latency, and user roles."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/app/analyze">
            <Button leftIcon={<ScanLine size={16} />}>New Food Scan</Button>
          </Link>
        </div>
      </div>

      {/* Role-tailored stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {roleStats.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            delta={stat.delta}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header
            title={`${role} Analytics & Freshness Trend`}
            subtitle="Weighted composite score tracking across current inventory"
          />
          <FreshnessTrendChart height={240} />
        </Card>

        {/* Recent activity & alerts */}
        <Card>
          <Card.Header title="Live Activity & Alerts" />
          <ul className="space-y-1">
            {RECENT_ACTIVITY.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {activity.item}
                  </p>
                  <p className="text-xs text-slate-400">
                    {activity.batch} · {activity.time}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[activity.status]}`}
                >
                  {activity.status}
                </span>
              </li>
            ))}
          </ul>
          <Card.Footer>
            <Link
              to="/app/inventory"
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              View full inventory <ArrowRight size={14} />
            </Link>
          </Card.Footer>
        </Card>
      </div>

      {/* Storage Condition Monitoring Widget for Warehouse Operator / Inspector */}
      {(role === ROLES.WAREHOUSE_OPERATOR || role === ROLES.RETAIL_MANAGER || role === ROLES.FOOD_INSPECTOR) && (
        <Card>
          <Card.Header
            title="Storage Condition Monitoring & Environmental Sensors"
            subtitle="Real-time temperature, humidity, air circulation and light compliance tracking"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">Cold Storage Temp</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Compliant</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">2.8°C</p>
              <p className="text-xs text-slate-400">Optimal Range: 1.0°C – 4.0°C</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">Relative Humidity</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Optimal</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">88%</p>
              <p className="text-xs text-slate-400">Target Range: 80% – 95%</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">Air Circulation</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Good Flow</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">0.4 m/s</p>
              <p className="text-xs text-slate-400">Continuous ventilation active</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">Light Exposure</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">Low Lux</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">12 Lux</p>
              <p className="text-xs text-slate-400">UV-filtered storage room</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
