import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { CATEGORIES } from '../constants/mockData';
import { FileText, Download, Filter, Calendar, CheckCircle2, History } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ReportsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const history = [
    { id: 'RPT-2026-091', title: 'Monthly Freshness & Waste Audit', date: '2026-07-28', size: '4.2 MB', format: 'PDF' },
    { id: 'RPT-2026-088', title: 'Cold Chain Telemetry Compliance', date: '2026-07-25', size: '2.8 MB', format: 'Excel' },
    { id: 'RPT-2026-079', title: 'Spoilage Anomaly Log Report', date: '2026-07-20', size: '1.9 MB', format: 'PDF' },
  ];

  const handleDownload = (format) => {
    setIsGenerating(true);
    toast.loading(`Generating ${format} report...`, { id: 'report-toast' });
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`${format} report generated & downloaded!`, { id: 'report-toast' });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-7 h-7 text-purple-400" /> Export Reports & Compliance Audits
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Generate formal HACCP, ISO 22000, and corporate sustainability PDF & Excel freshness reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Filter & Report Configurator */}
        <GlassCard className="lg:col-span-6 p-6 space-y-6 border-purple-500/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" /> Report Configuration
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Food Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none"
              >
                <option value="All" className="bg-[#0c1e33]">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#0c1e33]">{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Warehouse Facility</label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none"
              >
                <option value="All" className="bg-[#0c1e33]">All Facilities</option>
                <option value="Alpha" className="bg-[#0c1e33]">Cold Bay Alpha-1 & Alpha-2</option>
                <option value="Delta" className="bg-[#0c1e33]">Chiller Unit Delta</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
            <GlassButton
              variant="primary"
              size="md"
              className="w-full"
              icon={Download}
              loading={isGenerating}
              onClick={() => handleDownload('PDF')}
            >
              Export PDF Audit Report
            </GlassButton>
            <GlassButton
              variant="secondary"
              size="md"
              className="w-full"
              icon={Download}
              loading={isGenerating}
              onClick={() => handleDownload('Excel')}
            >
              Export Excel Spreadsheet
            </GlassButton>
          </div>
        </GlassCard>

        {/* Right Download History */}
        <GlassCard className="lg:col-span-6 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" /> Recent Report Generation Log
          </h3>

          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <span className="text-[11px] text-slate-400">{item.id} • Generated on {item.date} ({item.size})</span>
                </div>
                <button
                  onClick={() => toast.success(`Re-downloading ${item.id}`)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 font-semibold rounded-lg"
                >
                  {item.format}
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
