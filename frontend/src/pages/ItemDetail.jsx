import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import FreshnessStamp from "../components/FreshnessStamp";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const [itemRes, assessRes] = await Promise.all([
        api.get(`/inventory/${id}`),
        api.get(`/freshness/item/${id}`),
      ]);
      setItem(itemRes.data);
      setAssessments(assessRes.data);
    } catch {
      setError("Could not load this item.");
    }
  };

  useEffect(() => { load(); }, [id]);

  const uploadImage = async (file) => {
    if (!file) return;
    setBusy(true);
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      await api.post(`/freshness/assess/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await load();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not analyze this image.");
    } finally {
      setBusy(false);
    }
  };

  const latest = assessments[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow"><Link to="/inventory">Inventory</Link> / Item #{id}</p>
          <h1 className="page-title">{item ? item.name : "Loading…"}</h1>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <p className="stat-label" style={{ marginBottom: 10 }}>Upload a photo to assess freshness</p>
          <div
            className="dropzone"
            onClick={() => fileRef.current?.click()}
          >
            {busy ? "Analyzing…" : "Click to choose an image (JPG, PNG, WEBP)"}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => uploadImage(e.target.files[0])}
          />
        </div>

        {latest && (
          <div className="card" style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <FreshnessStamp score={latest.overall_freshness_score} category={latest.freshness_category} />
            <div>
              <div className={`tag ${latest.freshness_category}`}>{latest.freshness_category.replace("_", " ")}</div>
              <p className="muted" style={{ marginTop: 8 }}>
                Predicted remaining shelf life:{" "}
                <strong>{latest.predicted_remaining_shelf_life_days} days</strong>
              </p>
              <p className="muted">
                Spoilage probability: <strong>{Math.round(latest.spoilage_probability * 100)}%</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {latest && (
        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          <ScoreCard label="Visual condition" value={latest.visual_condition_score} />
          <ScoreCard label="Storage condition" value={latest.storage_condition_score} />
          <ScoreCard label="Shelf-life score" value={latest.shelf_life_score} />
          <ScoreCard label="Product age score" value={latest.product_age_score} />
        </div>
      )}

      {latest && latest.recommendations && (
        <div className="card" style={{ marginBottom: 24 }}>
          <p className="stat-label" style={{ marginBottom: 10 }}>Recommendations</p>
          <ul className="rec-list">
            {latest.recommendations.split("\n").map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      <div className="card">
        <p className="stat-label" style={{ marginBottom: 10 }}>Assessment history</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Category</th>
              <th>Remaining life</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.created_at).toLocaleString()}</td>
                <td>{a.overall_freshness_score}</td>
                <td><span className={`tag ${a.freshness_category}`}>{a.freshness_category.replace("_", " ")}</span></td>
                <td>{a.predicted_remaining_shelf_life_days} days</td>
              </tr>
            ))}
            {assessments.length === 0 && (
              <tr><td colSpan={4} className="muted">No assessments yet — upload a photo above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }) {
  return (
    <div className="card">
      <div className="stat-value" style={{ fontSize: 24 }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
