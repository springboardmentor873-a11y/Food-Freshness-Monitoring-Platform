import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Scale, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AnalyticsBoard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to load analytics:", err));
  }, []);

  if (!stats) return null;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div className="section-header">
        <h2>
          <BarChart3 size={22} color="var(--fresh-green)" />
          Food Quality Analytics & Waste Reduction Impact
        </h2>
        <p>Insights on scanned items, prevented food waste, and estimated financial savings.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">{stats.total_items_scanned}</div>
          <div className="stat-desc">Total Items Assessed</div>
        </div>

        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--fresh-green)' }}>{stats.average_freshness_score}%</div>
          <div className="stat-desc">Average Quality Score</div>
        </div>

        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--brand-cyan)' }}>${stats.estimated_money_saved_usd}</div>
          <div className="stat-desc">Estimated Money Saved</div>
        </div>

        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--warning-amber)' }}>{stats.waste_reduced_kg} kg</div>
          <div className="stat-desc">Food Waste Reduced</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
          Inventory Category Share
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {stats.category_distribution.map((cat, i) => (
            <div key={i} style={{ background: 'rgba(9,13,22,0.6)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--bg-card-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.name}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{cat.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
