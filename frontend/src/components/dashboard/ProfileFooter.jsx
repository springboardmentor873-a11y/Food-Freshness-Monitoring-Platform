function ProfileFooter() {
  return (
    <div className="flex items-center justify-between border-t pt-8">

      <button className="text-red-500">
        Deactivate Account
      </button>

      <div className="space-x-4">

        <button className="rounded-xl border px-6 py-3">
          Discard Changes
        </button>

        <button className="rounded-xl bg-blue-600 px-6 py-3 text-white">
          Save All Settings
        </button>

      </div>

    </div>
  );
}

export default ProfileFooter;