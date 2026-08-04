import { useState } from "react";
import { changePassword } from "../../services/auth";

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-3xl font-bold">
        Security & Authentication
      </h2>

      {message && <p className="mb-4 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}

      <div className="grid grid-cols-2 gap-8">

        <form onSubmit={handlePasswordChange} className="space-y-5">

          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full rounded-xl border p-4"
            placeholder="Current Password"
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={12}
            className="w-full rounded-xl border p-4"
            placeholder="New Password (min 12 chars)"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

        <div className="rounded-2xl bg-slate-50 p-6">

          <h3 className="font-bold text-green-600">
            2FA Enabled
          </h3>

          <p className="mt-2 text-gray-500">
            Your account is secured using Google Authenticator.
          </p>

          <button type="button" className="mt-6 rounded-xl border px-5 py-3">
            Configure 2FA
          </button>

        </div>

      </div>

    </div>
  );
}

export default SecuritySettings;