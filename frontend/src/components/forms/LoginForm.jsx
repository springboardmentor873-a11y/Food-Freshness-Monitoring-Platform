import { Mail, Lock, ShieldCheck } from "lucide-react";

function LoginForm() {
  return (
    <div className="flex items-center justify-center bg-white">

      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

        {/* Logo */}

        <div className="mb-10 flex items-center gap-4">

          <div className="rounded-2xl bg-green-600 p-4 text-white">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              AI Food Freshness
            </h2>

            <p className="text-gray-500">
              Monitoring System
            </p>
          </div>

        </div>

        {/* Heading */}

        <h1 className="text-4xl font-bold text-slate-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-gray-500">
          Sign in to continue
        </p>

        {/* Form */}

        <form className="mt-10 space-y-6">

          <div>

            <label className="mb-2 block font-medium">
              Email
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full p-4 outline-none"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Password
            </label>

            <div className="flex items-center rounded-xl border px-4">

              <Lock size={18} className="text-gray-400" />

              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 outline-none"
              />

            </div>

          </div>

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2">

              <input type="checkbox" />

              Remember Me

            </label>

            <button
              type="button"
              className="text-green-600 hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          <button
            className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700"
          >
            Login
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          © 2026 AI Food Freshness Monitoring
        </p>

      </div>

    </div>
  );
}

export default LoginForm;