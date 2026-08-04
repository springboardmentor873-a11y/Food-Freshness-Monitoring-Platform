import { useState } from "react";

import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthHeroBanner from "../../components/forms/AuthHeroBanner";
import { resetPassword } from "../../services/auth";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Password reset token is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ token, new_password: newPassword });
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid or expired reset token."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <AuthHeroBanner
          title="Reset Your Password"
          subtitle="Set a new secure password for your Freshness AI account."
        />

        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 lg:p-12">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 lg:p-10 shadow-xl border border-slate-100">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Set New Password
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 font-medium">
                Enter your new password below.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Reset Token
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  placeholder="Paste token if not auto-filled"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs font-mono font-semibold text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={18}
                    className="absolute left-4 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={12}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-11 text-sm font-semibold text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={18}
                    className="absolute left-4 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {message && (
                <div className="flex items-center gap-2 rounded-2xl bg-green-50 p-4 text-xs font-semibold text-green-800 border border-green-200">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-200">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? "Updating Password..." : "Update Password"}
              </button>
            </form>

            <p className="mt-8 text-center text-xs font-medium text-slate-500">
              Back to{" "}
              <Link
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                to="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;