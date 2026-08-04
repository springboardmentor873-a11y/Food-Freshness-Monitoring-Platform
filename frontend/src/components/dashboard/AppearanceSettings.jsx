import { Sun, Check } from "lucide-react";

function AppearanceSettings() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200/80">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Appearance Theme
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Standard Enterprise Light Theme enabled globally.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-2xl p-5 border-2 border-blue-600 bg-blue-50/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Sun size={20} />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900">
              Standard Light Theme
            </h3>
            <p className="text-[11px] text-slate-500">
              Clean high-brightness workspace theme.
            </p>
          </div>
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow">
          <Check size={14} />
        </span>
      </div>
    </div>
  );
}

export default AppearanceSettings;