import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Activity } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#040b15] border-t border-white/10 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="font-extrabold text-sm text-slate-100">AI Food Freshness</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Enterprise-grade AI freshness assessment, shelf-life prediction, and storage telemetry platform.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>FastAPI Backend Connected (Mock Online)</span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Platform Modules</h5>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Executive Dashboard</Link></li>
              <li><Link to="/inventory" className="hover:text-emerald-400 transition-colors">Food Inventory</Link></li>
              <li><Link to="/analysis" className="hover:text-emerald-400 transition-colors">AI Image Analysis</Link></li>
              <li><Link to="/freshness" className="hover:text-emerald-400 transition-colors">Freshness Assessment</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Analytics & Storage</h5>
            <ul className="space-y-2">
              <li><Link to="/shelf-life" className="hover:text-emerald-400 transition-colors">Shelf Life Prediction</Link></li>
              <li><Link to="/storage" className="hover:text-emerald-400 transition-colors">Storage Monitoring Telemetry</Link></li>
              <li><Link to="/reports" className="hover:text-emerald-400 transition-colors">Export Audit Reports</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Security & Compliance</h5>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-300 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>HACCP & ISO Compliant</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Encrypted AI telemetry streaming with real-time anomaly detection.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>© 2026 AI Food Freshness Monitoring Platform. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">API Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
