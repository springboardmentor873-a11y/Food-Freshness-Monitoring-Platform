import { useState } from "react";
import Card from "../components/ui/Card";
import Tabs from "../components/ui/Tabs";
import ProfileSettings from "../components/settings/ProfileSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import SecuritySettings from "../components/settings/SecuritySettings";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "appearance", label: "Appearance" },
  { id: "security", label: "Security" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your profile, appearance, and security preferences.
        </p>
      </div>

      <Card padding="none">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="px-4 sm:px-6" />
        <div className="p-5 sm:p-8">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </Card>
    </div>
  );
}
