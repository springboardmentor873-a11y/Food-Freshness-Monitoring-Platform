import {
  User,
  Shield,
  Bell,
  Globe,
} from "lucide-react";

const items = [
  { id: "personal-info", icon: User, text: "Personal Info" },
  { id: "security", icon: Shield, text: "Security" },
  { id: "notifications", icon: Bell, text: "Notifications" },
  { id: "language", icon: Globe, text: "Language" },
];

function ProfileSidebar({ activeSection = "personal-info", onSelectSection }) {
  return (
    <div className="sticky top-24 z-10 rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all duration-300">
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection && onSelectSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 text-xs ${
                isActive
                  ? "bg-green-50 text-green-700 font-bold shadow-xs border-l-4 border-green-600 pl-3"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
            >
              <Icon size={18} className={isActive ? "text-green-600" : "text-slate-400"} />
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProfileSidebar;