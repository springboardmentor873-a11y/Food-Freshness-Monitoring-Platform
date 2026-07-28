import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Thermometer, ShieldAlert, PlusCircle, Check } from 'lucide-react';

export default function AssessmentResult({ result, onAddToInventory }) {
  const [added, setAdded] = useState(false);
  const [foodName, setFoodName] = useState('');

  if (!result) {
    return (
      <div className="glass-card" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShieldAlert size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>No Active Assessment</h3>
        <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Select or upload a food image on the left to view real-time AI classification & freshness metrics.</p>
      </div>
    );
  }

  const { verdict, status, category, confidence, freshness_score, visual_features, shelf_life, recommendations } = result;

  const getVerdictBadge = () => {
    if (verdict === 'GOOD TO EAT') {
      return (
        <div className="verdict-badge verdict-good">
          <CheckCircle2 size={20} />
          {verdict}
        </div>
      );
    } else if (verdict === 'EAT IMMEDIATELY') {
      return (
        <div className="verdict-badge verdict-warn">
          <AlertTriangle size={20} />
          {verdict}
        </div>
      );
    } else {
      return (
        <div className="verdict-badge verdict-spoiled">
          <XCircle size={20} />
          {verdict}
        </div>
      );
    }
  };

  const handleSave = () => {
    const name = foodName.trim() || `${category} Item`;
    onAddToInventory({
      name,
      category,
      verdict,
      status,
      freshness_score,
      days_remaining: shelf_life.days_remaining,
      days_display: shelf_life.days_display,
      urgency: shelf_life.urgency
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            AI Verdict & Quality Assessment
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>{status}</h2>
        </div>
        {getVerdictBadge()}
      </div>

      {/* Main Score Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Model Confidence</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--fresh-green)', margin: '4px 0' }}>
            {confidence}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>ResNet Deep Learning</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--brand-cyan)" />
            Remaining Shelf-Life
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--brand-cyan)', margin: '4px 0' }}>
            {shelf_life.days_display}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Urgency Level: {shelf_life.urgency}</div>
        </div>
      </div>

      {/* Visual Feature Degradation Breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '14px' }}>
          Visual Degradation & Feature Analysis
        </h4>

        <div className="metric-row">
          <div className="metric-label">
            <span>Color Degradation</span>
            <span>{visual_features.color_degradation}%</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${visual_features.color_degradation}%`, background: visual_features.color_degradation > 40 ? 'var(--spoiled-red)' : 'var(--fresh-green)' }}></div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-label">
            <span>Texture Degradation Score</span>
            <span>{visual_features.texture_degradation}%</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${visual_features.texture_degradation}%`, background: visual_features.texture_degradation > 40 ? 'var(--warning-amber)' : 'var(--fresh-green)' }}></div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-label">
            <span>Mold / Spoilage Probability</span>
            <span>{visual_features.mold_probability}%</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${visual_features.mold_probability}%`, background: visual_features.mold_probability > 30 ? 'var(--spoiled-red)' : 'var(--fresh-green)' }}></div>
          </div>
        </div>

        <div className="metric-row">
          <div className="metric-label">
            <span>Surface Damage / Bruising Index</span>
            <span>{visual_features.bruising_index}%</span>
          </div>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${visual_features.bruising_index}%`, background: visual_features.bruising_index > 50 ? 'var(--warning-amber)' : 'var(--brand-cyan)' }}></div>
          </div>
        </div>
      </div>

      {/* Recommendations Checklist */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
          Smart Storage & Action Plan
        </h4>
        <ul className="recs-list">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="rec-item">
              <Thermometer size={16} color="var(--brand-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add to Inventory Quick Action */}
      <div style={{ display: 'flex', gap: '10px', pt: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <input
          type="text"
          placeholder="Custom Item Name (e.g., Red Delicious Apple)"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--bg-card-border)', background: 'rgba(9, 13, 22, 0.6)', color: 'white' }}
        />
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={added}
          style={{ minWidth: '160px', justifyContent: 'center' }}
        >
          {added ? <Check size={18} /> : <PlusCircle size={18} />}
          {added ? 'Item Saved!' : 'Add to Fridge'}
        </button>
      </div>
    </div>
  );
}
