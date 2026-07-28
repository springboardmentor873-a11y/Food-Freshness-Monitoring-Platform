import React from 'react';
import { Apple, Activity, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header glass-card">
      <div className="logo-group">
        <div className="logo-icon">
          <Apple size={26} color="#FFFFFF" />
        </div>
        <div className="logo-text">
          <h1>FreshVision AI</h1>
          <p>Food Freshness Monitoring & Shelf-Life Platform</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="system-status">
          <div className="status-dot"></div>
          <span>ResNet-50 Model Online</span>
        </div>
      </div>
    </header>
  );
}
