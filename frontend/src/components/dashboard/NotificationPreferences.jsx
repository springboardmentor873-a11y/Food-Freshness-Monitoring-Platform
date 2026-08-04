import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Mail, Bell, AlertTriangle } from "lucide-react";

function getInitialNotificationPrefs(user) {
  if (user?.notification_preferences) {
    try {
      const prefs = typeof user.notification_preferences === "string"
        ? JSON.parse(user.notification_preferences)
        : user.notification_preferences;
      return {
        email: prefs.email_alerts ?? true,
        push: prefs.push_notifications ?? true,
        spoilage: prefs.critical_spoilage ?? true,
      };
    } catch {
      // Fallback default
    }
  }
  return { email: true, push: true, spoilage: true };
}

function NotificationPreferences() {
  const { user, updateProfile } = useAuth();
  const initialPrefs = getInitialNotificationPrefs(user);

  const [emailAlerts, setEmailAlerts] = useState(initialPrefs.email);
  const [pushNotifications, setPushNotifications] = useState(initialPrefs.push);
  const [criticalSpoilage, setCriticalSpoilage] = useState(initialPrefs.spoilage);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggle = async (key, value, setter) => {
    setter(value);
    setSaving(true);
    setMessage("");

    const newPrefs = {
      email_alerts: key === "email_alerts" ? value : emailAlerts,
      push_notifications: key === "push_notifications" ? value : pushNotifications,
      critical_spoilage: key === "critical_spoilage" ? value : criticalSpoilage,
    };

    try {
      await updateProfile({
        notification_preferences: JSON.stringify(newPrefs),
      });
      setMessage("Notification preferences saved.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      // Revert if error
      setter(!value);
    } finally {
      setSaving(false);
    }
  };

  const toggles = [
    {
      key: "email_alerts",
      title: "Email Digest & Quality Alerts",
      desc: "Receive daily supply chain summaries and weekly freshness analytics via email.",
      icon: Mail,
      value: emailAlerts,
      setter: setEmailAlerts,
    },
    {
      key: "push_notifications",
      title: "Push & Real-time Sensor Notifications",
      desc: "Receive immediate browser alerts when sensor anomalies or predictions occur.",
      icon: Bell,
      value: pushNotifications,
      setter: setPushNotifications,
    },
    {
      key: "critical_spoilage",
      title: "Critical Spoilage Emergency Alerts",
      desc: "High priority alerts triggered whenever neural classification detects food spoilage.",
      icon: AlertTriangle,
      value: criticalSpoilage,
      setter: setCriticalSpoilage,
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200/80">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Notification Preferences
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated alert delivery methods across email and browser channels.
          </p>
        </div>

        {message && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            {message}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {toggles.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-2xl bg-slate-50 p-5 border border-slate-200/80"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500 max-w-lg">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                disabled={saving}
                onClick={() => handleToggle(item.key, !item.value, item.setter)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.value ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.value ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NotificationPreferences;