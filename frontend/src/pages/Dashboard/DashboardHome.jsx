import { useEffect, useState } from "react";
import {
  Boxes,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  Brain,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import StatCard from "../../components/ui/StatCard";
import PageTransition from "../../components/ui/PageTransition";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import FreshnessChart from "../../components/dashboard/FreshnessChart";
import WasteReduction from "../../components/dashboard/WasteReduction";
import RecentPredictionsTable from "../../components/dashboard/RecentPredictionsTable";
import DashboardActivityTimeline from "../../components/dashboard/DashboardActivityTimeline";
import SystemStatus from "../../components/dashboard/SystemStatus";

import { getAnalyticsOverview } from "../../services/analytics";

function DashboardHome() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    getAnalyticsOverview({ days })
      .then((data) => {
        if (active) {
          setAnalytics(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.detail ||
              "Unable to load Operations Overview data from backend."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [days, refreshKey]);


  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* Operations Center Top Header */}
        <DashboardHeader
          title="AI Operations Center"
          subtitle="Real-time food freshness analytics, automated predictions & storage oversight."
          days={days}
          onDaysChange={(newDays) => setDays(newDays)}
        />

        {/* Error State Banner */}
        {error && (
          <div className="flex items-center justify-between rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => {
                setLoading(true);
                setRefreshKey((prev) => prev + 1);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
            >

              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Enterprise KPI Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          <StatCard
            title="Total Foods"
            value={analytics ? analytics.total_foods.toLocaleString() : "0"}
            icon={<Boxes size={24} />}
            color="blue"
            description="Monitored in system"
            loading={loading}
          />

          <StatCard
            title="AI Predictions"
            value={analytics ? analytics.total_predictions.toLocaleString() : "0"}
            icon={<Sparkles size={24} />}
            color="purple"
            description="Inference logs"
            loading={loading}
          />

          <StatCard
            title="Fresh Rate"
            value={analytics ? `${analytics.fresh_percentage}%` : "0%"}
            icon={<TrendingUp size={24} />}
            color="green"
            trend="+3.2%"
            isPositive={true}
            progress={analytics ? analytics.fresh_percentage : 0}
            loading={loading}
          />

          <StatCard
            title="Spoilage Rate"
            value={analytics ? `${analytics.spoiled_percentage}%` : "0%"}
            icon={<AlertTriangle size={24} />}
            color="red"
            trend="-1.4%"
            isPositive={true}
            progress={analytics ? analytics.spoiled_percentage : 0}
            loading={loading}
          />

          <StatCard
            title="Near Expiry"
            value={analytics ? (analytics.near_expiry_count ?? 0).toString() : "0"}
            icon={<Clock size={24} />}
            color="amber"
            description="Expires in <= 3 days"
            loading={loading}
          />

          <StatCard
            title="AI Confidence"
            value={analytics ? `${analytics.average_confidence}%` : "0%"}
            icon={<Brain size={24} />}
            color="indigo"
            description="Model accuracy index"
            progress={analytics ? analytics.average_confidence : 0}
            loading={loading}
          />
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <FreshnessChart
              data={analytics?.prediction_trends || []}
              loading={loading}
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <WasteReduction
              data={analytics?.category_distribution || []}
              loading={loading}
            />
          </div>
        </div>

        {/* Live Operations & Health Section */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <RecentPredictionsTable
              predictions={analytics?.recent_activity || []}
              loading={loading}
            />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <SystemStatus />
            <DashboardActivityTimeline
              activity={analytics?.recent_activity || []}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default DashboardHome;