import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
} from "lucide-react";

const items = [
  { icon: User, text: "Personal Info", active: true },
  { icon: Shield, text: "Security" },
  { icon: Bell, text: "Notifications" },
  { icon: Palette, text: "Appearance" },
  { icon: Globe, text: "Language" },
];

function ProfileSidebar() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <div className="space-y-3">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.text}
              className={`flex w-full items-center gap-3 rounded-xl p-4 text-left transition ${
                item.active
                  ? "bg-green-50 text-green-600"
                  : "hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              {item.text}
            </button>
          );
        })}

      </div>

    </div>
  );
}

export default ProfileSidebar;