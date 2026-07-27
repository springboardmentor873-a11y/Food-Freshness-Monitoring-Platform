function SecuritySettings() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-3xl font-bold">
        Security & Authentication
      </h2>

      <div className="grid grid-cols-2 gap-8">

        <div className="space-y-5">

          <input
            type="password"
            className="w-full rounded-xl border p-4"
            placeholder="Current Password"
          />

          <input
            type="password"
            className="w-full rounded-xl border p-4"
            placeholder="New Password"
          />

          <button className="font-semibold text-blue-600">
            Update Password
          </button>

        </div>

        <div className="rounded-2xl bg-slate-50 p-6">

          <h3 className="font-bold text-green-600">
            2FA Enabled
          </h3>

          <p className="mt-2 text-gray-500">
            Your account is secured using Google Authenticator.
          </p>

          <button className="mt-6 rounded-xl border px-5 py-3">
            Configure 2FA
          </button>

        </div>

      </div>

    </div>
  );
}

export default SecuritySettings;