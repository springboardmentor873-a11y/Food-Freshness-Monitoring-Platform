import { useEffect, useState } from "react";
import ReportsHeader from "../../components/dashboard/ReportsHeader";
import ReportCards from "../../components/dashboard/ReportCards";
import ReportsHistory from "../../components/dashboard/ReportsHistory";
import PageTransition from "../../components/ui/PageTransition";
import { getPredictionHistory } from "../../services/history";
import { downloadPredictionReport } from "../../services/reports";
import { AlertCircle, CheckCircle, X } from "lucide-react";

function Reports() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  useEffect(() => {
    let active = true;

    getPredictionHistory({ page: 1, page_size: 20 })
      .then((data) => {
        if (active) {
          setHistory(data.items || []);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.detail || "Unable to load prediction reports history."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const download = async (format) => {
    setDownloading(format);
    setError("");
    try {
      await downloadPredictionReport(format);
      showToast(`${format.toUpperCase()} report generated successfully.`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail || "Unable to generate the system report."
      );
    } finally {
      setDownloading("");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* Toast Notification */}
        {toast.message && (
          <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 shadow-xl border text-sm font-semibold transition-all ${
              toast.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : (
              <CheckCircle size={20} className="text-green-600" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ message: "", type: "" })}
              className="ml-2 rounded-lg p-1 hover:bg-black/5"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <ReportsHeader onGenerate={() => download("pdf")} />

        {error && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-8">
            <ReportCards downloading={downloading} onDownload={download} />
            <ReportsHistory history={history} loading={loading} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Reports;
