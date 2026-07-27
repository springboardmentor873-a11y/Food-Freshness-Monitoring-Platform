function LanguageSettings() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-3xl font-bold">
        Language
      </h2>

      <select className="w-full rounded-xl border p-4">

        <option>English (United States)</option>

        <option>English (India)</option>

        <option>தமிழ்</option>

        <option>Hindi</option>

      </select>

    </div>
  );
}

export default LanguageSettings;