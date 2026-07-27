import {
  Users,
  UserCheck,
  ShieldCheck,
  Brain,
} from "lucide-react";

const stats = [
  {
    icon: <Users size={24} />,
    title: "Total Users",
    value: "124",
    color: "bg-blue-100 text-blue-600",
  },

  {
    icon: <UserCheck size={24} />,
    title: "Active Users",
    value: "87",
    color: "bg-green-100 text-green-600",
  },

  {
    icon: <ShieldCheck size={24} />,
    title: "System Health",
    value: "99%",
    color: "bg-emerald-100 text-emerald-600",
  },

  {
    icon: <Brain size={24} />,
    title: "AI Models",
    value: "4 Running",
    color: "bg-purple-100 text-purple-600",
  },
];

function AdminStats() {
  return (
    <div className="grid grid-cols-4 gap-6">

      {stats.map((item, index) => (

        <div
          key={index}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >

          <div
            className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${item.color}`}
          >
            {item.icon}
          </div>

          <p className="text-sm font-semibold uppercase text-gray-500">
            {item.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {item.value}
          </h2>

        </div>

      ))}

    </div>
  );
}

export default AdminStats;