import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { User, Phone, Mail, Image, Shield, Key } from "lucide-react";

function PersonalInformation() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone_number: phone.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });
      setMessage("Personal information updated successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update profile information.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200/80">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Update your account details and public profile avatar.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <p className="mb-6 rounded-2xl bg-green-50 p-4 text-xs font-semibold text-green-700 border border-green-200">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-6 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-200">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User size={16} className="absolute left-4 text-slate-400" />
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail size={16} className="absolute left-4 text-slate-400" />
            <input
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Phone Number
          </label>
          <div className="relative flex items-center">
            <Phone size={16} className="absolute left-4 text-slate-400" />
            <input
              type="text"
              placeholder="+1 (555) 012-3456"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Avatar Image URL
          </label>
          <div className="relative flex items-center">
            <Image size={16} className="absolute left-4 text-slate-400" />
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Assigned User Role (Read Only)
          </label>
          <div className="relative flex items-center">
            <Shield size={16} className="absolute left-4 text-slate-400" />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-xs font-bold text-slate-500 capitalize cursor-not-allowed"
              value={user?.role ? user.role.replace("_", " ") : "Consumer"}
              disabled
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Account Identifier (Read Only)
          </label>
          <div className="relative flex items-center">
            <Key size={16} className="absolute left-4 text-slate-400" />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
              value={user?.id || ""}
              disabled
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default PersonalInformation;