import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AuthHeroBanner from "../../components/forms/AuthHeroBanner";
import { forgotPassword } from "../../services/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetToken("");
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message || "Password reset token generated.");
      if (res.reset_token) {
        setResetToken(res.reset_token);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to process request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <AuthHeroBanner
          title="Account Security & Recovery"
          subtitle="Enterprise password recovery system with time-limited JWT reset credentials."
        />

        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 lg:p-12">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 lg:p-10 shadow-xl border border-slate-100">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Password Recovery
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 font-medium">
                Enter your registered email to receive reset instructions.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={18}
                    className="absolute left-4 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {message && (
                <div className="space-y-3 rounded-2xl bg-green-50 p-4 text-xs font-semibold text-green-800 border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    <span>{message}</span>
                  </div>
                  {resetToken && (
                    <div className="pt-2 border-t border-green-200/60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">Direct Reset Token:</p>
                      <code className="mt-1 block rounded bg-white p-2 text-[11px] font-mono text-slate-800 break-all select-all border border-green-200">
                        {resetToken}
                      </code>
                      <Link
                        to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
                        className="mt-2 inline-block text-xs font-bold text-blue-600 hover:underline"
                      >
                        Proceed to Reset Password →
                      </Link>
                    </div>
                  )}
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
                {isSubmitting ? "Sending Reset Link..." : "Send Password Reset Link"}
              </button>
            </form>

            <p className="mt-8 text-center text-xs font-medium text-slate-500">
              Remember your password?{" "}
              <Link
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 hover:underline"
                to="/login"
              >
                <ArrowLeft size={14} />
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;