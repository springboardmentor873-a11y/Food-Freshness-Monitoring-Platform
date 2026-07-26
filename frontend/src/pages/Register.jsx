import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ROLES = [
  { value: "consumer", label: "Consumer" },
  { value: "retail_manager", label: "Retail Manager" },
  { value: "warehouse_operator", label: "Warehouse Operator" },
  { value: "food_quality_inspector", label: "Food Quality Inspector" },
  { value: "administrator", label: "Administrator" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "consumer" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not create the account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <p className="page-eyebrow">Food Freshness Monitoring Platform</p>
        <h1 className="auth-title">Create an account</h1>

        {error && <div className="error-banner">{error}</div>}

        <div className="field">
          <label htmlFor="full_name">Full name</label>
          <input id="full_name" required value={form.full_name} onChange={update("full_name")} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={form.email} onChange={update("email")} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={8} value={form.password} onChange={update("password")} />
        </div>
        <div className="field">
          <label htmlFor="role">Role</label>
          <select id="role" value={form.role} onChange={update("role")}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <button className="btn" type="submit" disabled={busy} style={{ width: "100%", marginTop: 8 }}>
          {busy ? "Creating account…" : "Create account"}
        </button>

        <p className="muted" style={{ marginTop: 18, textAlign: "center" }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
