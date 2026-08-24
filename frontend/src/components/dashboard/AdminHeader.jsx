import { UserPlus, Sparkles, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { seedDemoData, clearDemoData } from "../../services/system";

function AdminHeader({ onAddUserClick, onSeedSuccess }) {
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await seedDemoData();
      setSeedMsg(`Seeded ${res.seeded_inventory} records!`);
      if (onSeedSuccess) {
        onSeedSuccess();
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
      setSeedMsg("Cleared demo dataset back to normal state!");
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
    <div className="space-y-4 border-b border-slate-200 pb-6">
      {seedMsg && (
        <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4 text-xs font-bold text-amber-800 border border-amber-200 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600" />
            <span>{seedMsg}</span>
          </div>
          <button onClick={() => setSeedMsg("")} className="text-amber-600 hover:text-amber-800">Dismiss</button>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Admin Operations Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage system users, grant administrative roles, and inspect platform diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding || clearing}
            className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-black text-white shadow-sm transition hover:bg-amber-600 hover:shadow-md disabled:opacity-50 cursor-pointer"
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
            className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 shadow-xs transition hover:bg-red-100 disabled:opacity-50 cursor-pointer"
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

          <button
            onClick={onAddUserClick}
            type="button"
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md cursor-pointer"
          >
            <UserPlus size={16} />
            Add New User
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;