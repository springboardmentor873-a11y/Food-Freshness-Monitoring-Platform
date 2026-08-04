import { Shield, UserCheck, UserX } from "lucide-react";

function UsersTable({ users = [], loading = false, onUpdateRole }) {
  const rolesOptions = ["consumer", "manager", "admin"];

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
      <div className="border-b px-8 py-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            User Management & Access Control
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage platform users, update access permissions, and revoke privileges.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-100">
          {users.length} Registered User{users.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="px-8 py-4">Name & Email</th>
              <th className="px-6 py-4">Assigned Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Role Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {loading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Loading user records...
                </td>
              </tr>
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No user records found.
                </td>
              </tr>
            )}

            {!loading &&
              users.map((user) => {
                const currentRole = (user.role || "consumer").toLowerCase();
                const isActive = user.is_active !== false;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/60 transition"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold text-sm">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          currentRole === "admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : currentRole === "manager"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        <Shield size={12} />
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      {onUpdateRole && (
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={currentRole}
                            onChange={(e) =>
                              onUpdateRole(user.id, { role: e.target.value })
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none cursor-pointer"
                          >
                            {rolesOptions.map((roleOpt) => (
                              <option key={roleOpt} value={roleOpt}>
                                Set to {roleOpt.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTable;