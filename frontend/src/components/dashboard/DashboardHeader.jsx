import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Plus, Upload, ScanLine, FileText, Search, Shield, Calendar, Sparkles, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { seedDemoData, clearDemoData } from "../../services/system";

function DashboardHeader({
  title = "AI Operations Center",
  subtitle = "Real-time AI model freshness monitoring & inventory control.",
  days = 30,
  onDaysChange,
  onSearch,
  onSeedSuccess,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const userRole = (user?.role || "consumer").toUpperCase();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
    } else if (searchTerm.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await seedDemoData();
      setSeedMsg(`Loaded ${res.seeded_inventory} enterprise demo records!`);
      if (onSeedSuccess) {
        onSeedSuccess(res);
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch {
      setSeedMsg("Failed to seed demo data.");
    } finally {
      setSeeding(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    setSeedMsg("");
    try {
      await clearDemoData();
      setSeedMsg("Cleared all demo data. Reset back to normal state!");
      if (onSeedSuccess) {
        onSeedSuccess();
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch {
      setSeedMsg("Failed to clear demo data.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="mb-8 space-y-6">
      {seedMsg && (
        <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4 text-xs font-bold text-amber-800 border border-amber-200 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600" />
            <span>{seedMsg}</span>
          </div>
          <button onClick={() => setSeedMsg("")} className="text-amber-600 hover:text-amber-800">Dismiss</button>
        </div>
      )}

      {/* Upper Operations Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200">
              <Shield size={12} />
              ROLE: {userRole}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        {/* Global Search & Time Range Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search food, batch ID..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </form>

          {onDaysChange && (
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <Calendar size={14} className="text-slate-400" />
              <select
                value={days}
                onChange={(e) => onDaysChange(Number(e.target.value))}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/food-detection")}
            className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md cursor-pointer"
          >
            <ScanLine size={16} />
            Scan Food
          </button>

          <button
            type="button"
            onClick={() => navigate("/food-detection")}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md cursor-pointer"
          >
            <Upload size={16} />
            Upload Image
          </button>

          <button
            type="button"
            onClick={() => navigate("/inventory")}
            className="flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-purple-700 hover:shadow-md cursor-pointer"
          >
            <Plus size={16} />
            Add Inventory
          </button>

          <button
            type="button"
            onClick={() => navigate("/reports")}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <FileText size={16} />
            Generate Report
          </button>
        </div>

        {/* Demo Data Management Group */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding || clearing}
            className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-amber-600 hover:shadow-md disabled:opacity-50 cursor-pointer"
          >
            {seeding ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Seeding...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                ⚡ Load Enterprise Demo Data
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={seeding || clearing}
            className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 shadow-xs transition hover:bg-red-100 disabled:opacity-50 cursor-pointer"
          >
            {clearing ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Clear Demo Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;