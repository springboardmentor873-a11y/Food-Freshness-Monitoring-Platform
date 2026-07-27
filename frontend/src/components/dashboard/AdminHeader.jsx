import { UserPlus } from "lucide-react";

function AdminHeader() {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-5xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Manage users, monitor system health, and control platform settings.
        </p>

      </div>

      <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">

        <UserPlus size={18} />

        Add User

      </button>

    </div>
  );
}

export default AdminHeader;