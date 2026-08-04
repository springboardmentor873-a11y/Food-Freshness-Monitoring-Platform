import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Globe } from "lucide-react";

function LanguageSettings() {
  const { user, updateProfile } = useAuth();
  const [lang, setLang] = useState(user?.language || "en");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = async (newLang) => {
    setLang(newLang);
    setSaving(true);
    setMessage("");
    try {
      await updateProfile({ language: newLang });
      setMessage("Language preference saved.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      // Revert if error
    } finally {
      setSaving(false);
    }
  };

  const languages = [
    { code: "en", name: "English (United States)" },
    { code: "es", name: "Spanish (Español)" },
    { code: "fr", name: "French (Français)" },
    { code: "de", name: "German (Deutsch)" },
  ];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200/80">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Language & Region
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Set default interface display language.
          </p>
        </div>

        {message && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            {message}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <Globe size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
        <select
          value={lang}
          disabled={saving}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-8 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default LanguageSettings;