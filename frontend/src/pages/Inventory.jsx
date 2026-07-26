import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const CATEGORIES = [
  "fruits", "vegetables", "dairy", "meat_poultry", "seafood",
  "bakery", "packaged_foods", "beverages",
];

const emptyForm = {
  name: "",
  category: "fruits",
  batch_number: "",
  quantity: 1,
  unit: "kg",
  packaging_type: "unpackaged",
  storage_temperature_c: "",
  storage_humidity_pct: "",
};

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = () => {
    api
      .get("/inventory")
      .then((res) => setItems(res.data))
      .catch(() => setError("Could not load inventory."));
  };

  useEffect(load, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        storage_temperature_c: form.storage_temperature_c === "" ? null : Number(form.storage_temperature_c),
        storage_humidity_pct: form.storage_humidity_pct === "" ? null : Number(form.storage_humidity_pct),
      };
      await api.post("/inventory", payload);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not add the item.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Registry</p>
          <h1 className="page-title">Food inventory</h1>
        </div>
        <button className="btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Register item"}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <form className="card" onSubmit={submit} style={{ marginBottom: 24 }}>
          <div className="grid grid-2">
            <div className="field">
              <label>Name</label>
              <input required value={form.name} onChange={update("name")} placeholder="e.g. Bananas" />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={update("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Batch number</label>
              <input value={form.batch_number} onChange={update("batch_number")} placeholder="B-1024" />
            </div>
            <div className="field">
              <label>Quantity</label>
              <input type="number" step="0.1" value={form.quantity} onChange={update("quantity")} />
            </div>
            <div className="field">
              <label>Storage temperature (°C)</label>
              <input type="number" step="0.1" value={form.storage_temperature_c} onChange={update("storage_temperature_c")} />
            </div>
            <div className="field">
              <label>Storage humidity (%)</label>
              <input type="number" step="0.1" value={form.storage_humidity_pct} onChange={update("storage_humidity_pct")} />
            </div>
          </div>
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save item"}
          </button>
        </form>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Batch</th>
              <th>Quantity</th>
              <th>Storage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category.replace("_", " ")}</td>
                <td>{item.batch_number || "—"}</td>
                <td>{item.quantity} {item.unit}</td>
                <td>
                  {item.storage_temperature_c != null ? `${item.storage_temperature_c}°C` : "—"}
                  {item.storage_humidity_pct != null ? ` / ${item.storage_humidity_pct}%` : ""}
                </td>
                <td>
                  <Link to={`/inventory/${item.id}`} className="btn secondary" style={{ padding: "5px 12px" }}>
                    Assess
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="muted">No items registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
