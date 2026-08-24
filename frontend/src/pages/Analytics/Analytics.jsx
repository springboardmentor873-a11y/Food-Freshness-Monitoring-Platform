import { useEffect, useState } from "react";
import AnalyticsHeader from "../../components/dashboard/AnalyticsHeader";
import AnalyticsStats from "../../components/dashboard/AnalyticsStats";
import FreshnessChart from "../../components/dashboard/FreshnessChart";
import WasteReduction from "../../components/dashboard/WasteReduction";
import QualityFeed from "../../components/dashboard/QualityFeed";
import PageTransition from "../../components/ui/PageTransition";
import { getAnalyticsOverview } from "../../services/analytics";
import { downloadPredictionReport } from "../../services/reports";
import { AlertCircle, FileDown, LoaderCircle } from "lucide-react";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [days, setDays] = useState(30);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;

    getAnalyticsOverview({ days })
      .then((data) => {
        if (active) {
          setAnalytics(data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.detail || "Unable to load analytics data."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [days]);

  const handleExportReport = async () => {
    setExporting(true);
    try {
      await downloadPredictionReport("pdf");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to download analytics PDF report.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <AnalyticsHeader />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                Time:
              </span>
              <select
                value={days}
                onChange={(e) => {
                  setDays(Number(e.target.value));
                  setLoading(true);
                }}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
                <option value={365}>Last 1 Year</option>
              </select>
            </div>

            <button
              onClick={handleExportReport}
              disabled={exporting}
              type="button"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:opacity-50 cursor-pointer"
            >
              {exporting ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown size={15} />
                  Export Analytics PDF
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Analytics KPI Cards */}
        <AnalyticsStats analytics={analytics} loading={loading} />

        {/* Charts Section */}
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

        {/* Quality Feed / Recent Predictions */}
        <QualityFeed
          activity={analytics?.recent_activity || []}
          loading={loading}
        />
      </div>
    </PageTransition>
  );
}

export default Analytics;
