function PersonalInformation() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-3xl font-bold">
          Personal Information
        </h2>

        <button className="rounded-xl bg-blue-600 px-6 py-3 text-white">
          Save Changes
        </button>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <input
          className="rounded-xl border p-4"
          defaultValue="Alex Rivera"
        />

        <input
          className="rounded-xl border p-4"
          defaultValue="Supply Chain Director"
        />

        <input
          className="rounded-xl border p-4"
          defaultValue="alex.rivera@freshai.com"
        />

        <input
          className="rounded-xl border p-4"
          defaultValue="+1 (555) 012-3456"
        />

      </div>

    </div>
  );
}

export default PersonalInformation;