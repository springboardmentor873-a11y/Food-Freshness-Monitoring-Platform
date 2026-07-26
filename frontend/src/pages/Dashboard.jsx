import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setError("Could not load the dashboard summary."));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1 className="page-title">Freshness dashboard</h1>
        </div>
        <Link to="/inventory" className="btn secondary">View inventory</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {summary && (
        <>
          <div className="grid grid-4" style={{ marginBottom: 20 }}>
            <div className="card">
              <div className="stat-value">{summary.total_items}</div>
              <div className="stat-label">Items tracked</div>
            </div>
            <div className="card">
              <div className="stat-value">{summary.fresh_count}</div>
              <div className="stat-label">Fresh</div>
            </div>
            <div className="card">
              <div className="stat-value">{summary.near_spoilage_count}</div>
              <div className="stat-label">Near spoilage</div>
            </div>
            <div className="card">
              <div className="stat-value">{summary.spoiled_count}</div>
              <div className="stat-label">Spoiled</div>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <p className="stat-label" style={{ marginBottom: 6 }}>Average freshness score</p>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 42, fontWeight: 700, color: "var(--orchard)" }}>
                {summary.average_freshness_score}
                <span style={{ fontSize: 16, color: "var(--ink-soft)" }}> / 100</span>
              </div>
            </div>

            <div className="card">
              <p className="stat-label" style={{ marginBottom: 10 }}>Expiring within 3 days</p>
              {summary.items_expiring_soon.length === 0 ? (
                <p className="muted">Nothing expiring soon.</p>
              ) : (
                <ul className="rec-list">
                  {summary.items_expiring_soon.map((item) => (
                    <li key={item.id}>
                      {item.name} — batch {item.batch_number || "n/a"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
