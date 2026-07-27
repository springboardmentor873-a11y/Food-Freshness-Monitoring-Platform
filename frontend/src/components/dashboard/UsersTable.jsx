import { Edit, Trash2 } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Alex Rivera",
    email: "alex@freshai.com",
    role: "Administrator",
    status: "Active",
  },

  {
    id: 2,
    name: "Marcus V.",
    email: "marcus@freshai.com",
    role: "Manager",
    status: "Active",
  },

  {
    id: 3,
    name: "Eleanor Vance",
    email: "eleanor@freshai.com",
    role: "QA Director",
    status: "Offline",
  },

  {
    id: 4,
    name: "Sarah Kim",
    email: "sarah@freshai.com",
    role: "Operator",
    status: "Active",
  },
];

function UsersTable() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

      <div className="border-b px-8 py-6">

        <h2 className="text-2xl font-bold">
          Users Management
        </h2>

      </div>

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr className="text-left text-sm uppercase text-gray-500">

            <th className="px-8 py-4">Name</th>

            <th>Email</th>

            <th>Role</th>

            <th>Status</th>

            <th className="text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user.id}
              className="border-t"
            >

              <td className="px-8 py-5 font-semibold">
                {user.name}
              </td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {user.status}
                </span>

              </td>

              <td>

                <div className="flex justify-center gap-3">

                  <button className="rounded-lg border p-2 hover:bg-gray-100">
                    <Edit size={18} />
                  </button>

                  <button className="rounded-lg border p-2 text-red-600 hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default UsersTable;