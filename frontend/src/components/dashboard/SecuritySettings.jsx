import { useState } from "react";
import { changePassword } from "../../services/auth";
import { ShieldCheck, Lock, KeyRound, CheckCircle2, X, QrCode } from "lucide-react";

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200/80">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Security & Authentication
          </h2>
          <p className="text-xs text-slate-400">Manage credentials, password policies, and two-factor authentication</p>
        </div>
      </div>

      {message && <p className="mb-6 rounded-2xl bg-green-50 p-4 text-xs font-bold text-green-700 border border-green-200">{message}</p>}
      {error && <p className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Change Password</h3>

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="Current Password"
            />
          </div>

          <div className="relative">
            <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={12}
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
              placeholder="New Password (min 12 chars)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200/70 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Two-Factor Authentication (2FA)
            </h3>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
              twoFactorEnabled ? "bg-green-100 text-green-700 border border-green-200" : "bg-slate-200 text-slate-700"
            }`}>
              <CheckCircle2 size={12} />
              {twoFactorEnabled ? "2FA Active" : "2FA Disabled"}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Your enterprise account is secured using Google Authenticator / TOTP. Require a secondary security token on sign in.
          </p>

          <button
            type="button"
            onClick={() => setIs2FAModalOpen(true)}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Configure 2FA Settings
          </button>
        </div>
      </div>

      {/* 2FA Modal */}
      {is2FAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600 border border-green-200">
                  <QrCode size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">2FA Authenticator Settings</h3>
                  <p className="text-xs text-slate-400">Google Authenticator TOTP Setup</p>
                </div>
              </div>
              <button
                onClick={() => setIs2FAModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex justify-center">
                <div className="h-32 w-32 bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-center shadow-xs">
                  <QrCode size={96} className="text-slate-800" />
                </div>
              </div>
              <p className="text-xs font-mono font-bold text-slate-600">SECRET: ABCD-EFGH-JKLM-NOPQ</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Scan QR code with Google Authenticator or Duo Security app.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  setIs2FAModalOpen(false);
                }}
                className={`flex-1 rounded-2xl py-3 text-xs font-bold text-white shadow-sm transition ${
                  twoFactorEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </button>
              <button
                onClick={() => setIs2FAModalOpen(false)}
                className="flex-1 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecuritySettings;