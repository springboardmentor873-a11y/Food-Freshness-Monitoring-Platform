import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Sparkles, Package, FileText, Bell, Thermometer, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    inventory, 
    analyses, 
    reports, 
    notifications,
    setCurrentPage,
    setSelectedInventoryId,
    setSelectedAnalysisId
  } = useApp();

  if (!isSearchOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  const filteredInventory = query
    ? inventory.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.batchId.toLowerCase().includes(query)
      )
    : [];

  const filteredAnalyses = query
    ? analyses.filter(
        (a) =>
          a.foodName.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query) ||
          a.predictedClass.toLowerCase().includes(query)
      )
    : [];

  const filteredReports = query
    ? reports.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.type.toLowerCase().includes(query)
      )
    : [];

  const filteredNotifs = query
    ? notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.description.toLowerCase().includes(query)
      )
    : [];

  const totalResults =
    filteredInventory.length +
    filteredAnalyses.length +
    filteredReports.length +
    filteredNotifs.length;

  return (
    <div 
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        id="global-search-modal"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
          <input
            type="text"
            id="global-search-input"
            placeholder="Search produce, scan records, reports, batch IDs, alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
              <p>Type to search across food inventory, AI freshness scans, compliance audits, and alerts.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['Tomatoes', 'Spinach', 'Cold Room', 'Expiring', 'Batch'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p>No results found for &ldquo;<span className="font-semibold text-slate-600 dark:text-slate-300">{searchQuery}</span>&rdquo;</p>
              <p className="mt-1">Try searching by food name (e.g. &ldquo;Tomato&rdquo;) or batch ID.</p>
            </div>
          )}

          {/* Inventory Matches */}
          {filteredInventory.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <Package className="w-3.5 h-3.5 text-emerald-500" />
                <span>Inventory Items ({filteredInventory.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredInventory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedInventoryId(item.id);
                      setCurrentPage('inventory-detail');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Batch: {item.batchId} • {item.quantity} {item.unit} • Score: {item.freshnessScore}/100
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analyses Matches */}
          {filteredAnalyses.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                <span>AI Freshness Scans ({filteredAnalyses.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredAnalyses.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setSelectedAnalysisId(a.id);
                      setCurrentPage('analysis-detail');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={a.imageUrl} alt={a.foodName} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                          {a.foodName} ({a.predictedClass})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Freshness: {a.freshnessScore}/100 • Shelf-life: {a.remainingShelfLifeDays}d left
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reports Matches */}
          {filteredReports.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Reports & Audits ({filteredReports.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredReports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentPage('reports');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-left transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {r.type} • {r.format} • Generated: {r.generatedDate}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>FreshSense AI Global Index</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
