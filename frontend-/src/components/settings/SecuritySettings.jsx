import { useState } from "react";
import { ShieldCheck, KeyRound } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { appToast } from "../ui/Toast";

/**
 * SecuritySettings — password change form + a two-factor toggle.
 * Mock-only: swap handleSubmit for authService.changePassword(form)
 * once FastAPI is live.
 */
export default function SecuritySettings() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [twoFactor, setTwoFactor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.current) next.current = "Enter your current password";
    if (!form.next) next.next = "Enter a new password";
    else if (form.next.length < 8) next.next = "Use at least 8 characters";
    if (form.confirm !== form.next) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setForm({ current: "", next: "", confirm: "" });
      appToast.success("Password updated");
    }, 700);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <KeyRound size={16} className="text-slate-400" /> Change Password
        </div>
        <Input
          label="Current password"
          type="password"
          value={form.current}
          onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
          error={errors.current}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="New password"
            type="password"
            value={form.next}
            onChange={(e) => setForm((f) => ({ ...f, next: e.target.value }))}
            error={errors.next}
          />
          <Input
            label="Confirm new password"
            type="password"
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            error={errors.confirm}
          />
        </div>
        <Button type="submit" isLoading={isSaving}>
          Update Password
        </Button>
      </form>

      <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <ShieldCheck size={18} />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Two-factor authentication</p>
            <p className="text-xs text-slate-400">Add an extra layer of security to your account.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setTwoFactor((v) => !v);
            appToast.success(twoFactor ? "Two-factor authentication disabled" : "Two-factor authentication enabled");
          }}
          role="switch"
          aria-checked={twoFactor}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            twoFactor ? "bg-gradient-brand" : "bg-slate-200 dark:bg-slate-700"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              twoFactor ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
