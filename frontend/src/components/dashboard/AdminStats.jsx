import { Users, UserCheck, ShieldCheck, Brain } from "lucide-react";

function AdminStats({ statsData, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 animate-pulse space-y-3"
          >
            <div className="h-14 w-14 rounded-2xl bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-8 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      icon: <Users size={24} />,
      title: "Total Registered Users",
      value: statsData?.total_users ?? "0",
      color: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      icon: <UserCheck size={24} />,
      title: "Active Accounts",
      value: statsData?.active_users ?? "0",
      color: "bg-green-50 text-green-600 border border-green-100",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Admin Accounts",
      value: statsData?.admin_users ?? "0",
      color: "bg-purple-50 text-purple-600 border border-purple-100",
    },
    {
      icon: <Brain size={24} />,
      title: "Total AI Predictions",
      value: statsData?.total_predictions ?? "0",
      color: "bg-amber-50 text-amber-600 border border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100"
        >
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
          >
            {item.icon}
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {item.title}
          </p>

          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default AdminStats;