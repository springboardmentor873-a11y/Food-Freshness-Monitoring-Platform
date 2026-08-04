import { Activity, Database, Cpu, HardDrive } from "lucide-react";

function SystemStatus() {
  const services = [
    { title: "FastAPI Backend", icon: <Activity size={16} />, status: "Healthy" },
    { title: "PostgreSQL Database", icon: <Database size={16} />, status: "Online" },
    { title: "EfficientNet AI Engine", icon: <Cpu size={16} />, status: "Operational" },
    { title: "Cloud Asset Storage", icon: <HardDrive size={16} />, status: "Online" },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Diagnostics</h2>
          <p className="text-xs text-slate-400">Infrastructure probes</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
          All Systems Nominal
        </span>
      </div>

      <div className="space-y-3">
        {services.map((srv) => (
          <div
            key={srv.title}
            className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-sm"
          >
            <div className="flex items-center gap-3 font-semibold text-slate-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-500 shadow-inner">
                {srv.icon}
              </div>
              <span className="text-xs">{srv.title}</span>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200">
              {srv.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SystemStatus;