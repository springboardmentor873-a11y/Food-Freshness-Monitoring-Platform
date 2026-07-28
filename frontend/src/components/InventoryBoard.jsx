import React, { useState } from 'react';
import { Package, Trash2, Clock, MapPin, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function InventoryBoard({ inventory, onDeleteItem }) {
  const [filter, setFilter] = useState('ALL');

  const filteredItems = inventory.filter(item => {
    if (filter === 'FRESH') return item.freshness_score >= 70;
    if (filter === 'WARNING') return item.freshness_score >= 40 && item.freshness_score < 70;
    if (filter === 'EXPIRED') return item.freshness_score < 40;
    return true;
  });

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h2>
            <Package size={22} color="var(--brand-cyan)" />
            Food Inventory & Expiry Tracker
          </h2>
          <p>Active items in fridge & pantry with real-time remaining shelf life countdowns.</p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(9,13,22,0.6)', padding: '4px', borderRadius: '10px', border: '1px solid var(--bg-card-border)' }}>
          {['ALL', 'FRESH', 'WARNING', 'EXPIRED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                border: 'none',
                background: filter === f ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: filter === f ? '#FFF' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <ShieldAlert size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p>No food items match the selected filter.</p>
        </div>
      ) : (
        <div className="inventory-grid">
          {filteredItems.map(item => {
            const isFresh = item.freshness_score >= 70;
            const isWarn = item.freshness_score >= 40 && item.freshness_score < 70;

            return (
              <div key={item.id} className="inv-card">
                <div>
                  <div className="inv-header">
                    <div>
                      <div className="inv-title">{item.name}</div>
                      <div className="inv-meta">Scanned: {item.scanned_at}</div>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: isFresh ? 'rgba(16, 185, 129, 0.15)' : isWarn ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isFresh ? 'var(--fresh-green)' : isWarn ? 'var(--warning-amber)' : 'var(--spoiled-red)',
                        border: `1px solid ${isFresh ? 'rgba(16,185,129,0.3)' : isWarn ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`
                      }}
                    >
                      {item.freshness_score}% Fresh
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginTop: '12px', color: 'var(--brand-cyan)' }}>
                    <Clock size={16} />
                    <span>Expires in: <strong>{item.days_display}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <MapPin size={14} />
                    <span>{item.location || 'Refrigerator'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category: {item.category}</span>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} hover={{ color: 'var(--spoiled-red)' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
