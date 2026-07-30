import { useState } from "react";
import { Save } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { CURRENT_USER } from "../../mocks/user";
import { appToast } from "../ui/Toast";

const ROLES = ["Consumer", "Retail Manager", "Warehouse Operator", "Food Quality Inspector", "Administrator"];

/**
 * ProfileSettings — name/email/role form. Mock-saves for now; swap
 * handleSave for authService.updateProfile(form) once FastAPI is live.
 */
export default function ProfileSettings() {
  const [form, setForm] = useState({
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    role: CURRENT_USER.role,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      appToast.success("Profile updated");
    }, 700);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex items-center gap-4">
        <span
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold text-white ${CURRENT_USER.avatarColor}`}
        >
          {CURRENT_USER.avatarInitials}
        </span>
        <div>
          <Button type="button" variant="secondary" size="sm">
            Change Photo
          </Button>
          <p className="mt-1.5 text-xs text-slate-400">JPG or PNG, up to 2MB</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          label="Email address"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-64"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
        <Button type="submit" leftIcon={<Save size={16} />} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
