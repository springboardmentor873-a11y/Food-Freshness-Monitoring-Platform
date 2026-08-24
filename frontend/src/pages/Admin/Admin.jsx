import { useEffect, useState } from "react";
import AdminHeader from "../../components/dashboard/AdminHeader";
import AdminStats from "../../components/dashboard/AdminStats";
import UsersTable from "../../components/dashboard/UsersTable";
import SystemStatus from "../../components/dashboard/SystemStatus";
import RecentActivity from "../../components/dashboard/RecentActivity";
import AddUserModal from "../../components/modals/AddUserModal";
import PageTransition from "../../components/ui/PageTransition";
import { getAdminStats, getAdminUsers, updateUserRole } from "../../services/admin";
import { AlertCircle, CheckCircle, X } from "lucide-react";

function Admin() {
  const [usersData, setUsersData] = useState({ items: [], total: 0 });
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  useEffect(() => {
    let active = true;

    Promise.all([getAdminUsers({ page: 1, page_size: 50 }), getAdminStats()])
      .then(([usersRes, statsRes]) => {
        if (active) {
          setUsersData(usersRes);
          setStatsData(statsRes);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.detail ||
              "Unable to load administrative controls and user data."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleUpdateRole = async (userId, payload) => {
    try {
      await updateUserRole(userId, payload);
      showToast("User role updated successfully.");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Failed to update user role.",
        "error"
      );
    }
  };

  const handleUserAdded = (successMessage) => {
    showToast(successMessage, "success");
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* Toast Alert */}
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

        <AdminHeader onAddUserClick={() => setIsAddUserOpen(true)} />

        {error && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Admin Statistics */}
        <AdminStats statsData={statsData} loading={loading} />

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <UsersTable
              users={usersData.items}
              loading={loading}
              onUpdateRole={handleUpdateRole}
            />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <SystemStatus />
            <RecentActivity />
          </div>
        </div>

        {/* Add User Modal */}
        <AddUserModal
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          onSuccess={handleUserAdded}
        />
      </div>
    </PageTransition>
  );
}

export default Admin;