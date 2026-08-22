import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Package, 
  Sparkles, 
  Calendar, 
  Clock, 
  Thermometer, 
  Droplets, 
  CheckCircle2, 
  AlertTriangle, 
  ScanLine, 
  Layers,
  FileText,
  RotateCw
} from 'lucide-react';

export const InventoryDetailPage: React.FC = () => {
  const { selectedInventoryId, inventory, setCurrentPage } = useApp();

  const item = inventory.find((i) => i.id === selectedInventoryId) || inventory[0];

  if (!item) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">Item not found.</p>
        <button
          onClick={() => setCurrentPage('inventory')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Return to Inventory
        </button>
      </div>
    );
  }

  return (
    <div id="inventory-detail-page" className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => setCurrentPage('inventory')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Inventory Registry</span>
      </button>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                {item.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {item.batchId}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Category: {item.category} • Current Stock: {item.quantity} {item.unit} • Location: {item.storageLocation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('analyze')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <ScanLine className="w-4 h-4" />
            <span>Re-evaluate Freshness</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Freshness Score</span>
          <div className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5" />
            <span>{item.freshnessScore}/100</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Class: {item.freshnessCategory}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Remaining Shelf Life</span>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {item.remainingDays} <span className="text-sm font-semibold text-slate-400">days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Expiry: {item.expiryDate}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Storage Temperature</span>
          <div className="mt-2 text-3xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <Thermometer className="w-5 h-5" />
            <span>{item.temperature}°C</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Humidity: {item.humidity}%</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Packaging Type</span>
          <div className="mt-2 text-base font-bold text-slate-900 dark:text-white truncate">
            {item.packaging}
          </div>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Protected barrier</p>
        </div>
      </div>

      {/* Batch Timeline & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Batch Audit & Freshness Timeline
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Harvest & Ingestion Logged</div>
                <div className="text-[11px] text-slate-400">Date: {item.purchaseDate} • Registered into {item.storageLocation}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Quality Inspection</div>
                <div className="text-[11px] text-slate-400">Date: {item.lastInspected} • Freshness score verified at {item.freshnessScore}/100</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Projected Expiration Threshold</div>
                <div className="text-[11px] text-slate-400">Date: {item.expiryDate} ({item.remainingDays} days from now)</div>
              </div>
            </div>
          </div>

          {item.notes && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Operator Notes:</span>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{item.notes}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recommended Action Plan
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs space-y-2">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Optimal Climate Maintained</span>
            </div>
            <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed">
              Keep in {item.storageLocation} at {item.temperature}°C to sustain the {item.remainingDays}-day shelf life.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('recommendations')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors text-center"
          >
            View Global Recommendations Hub
          </button>
        </div>
      </div>
    </div>
  );
};
