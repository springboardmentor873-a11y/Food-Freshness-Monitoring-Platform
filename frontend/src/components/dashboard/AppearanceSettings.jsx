function AppearanceSettings() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-3xl font-bold">
        Appearance
      </h2>

      <div className="grid grid-cols-2 gap-5">

        <button className="rounded-2xl border-2 border-green-500 p-8">
          Light
        </button>

        <button className="rounded-2xl border p-8 bg-slate-800 text-white">
          Dark
        </button>

      </div>

    </div>
  );
}

export default AppearanceSettings;