import React, { useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { CATEGORIES, FRESHNESS_GRADES } from '../constants/mockData';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { SearchBar } from '../components/common/SearchBar';
import { GlassModal } from '../components/common/GlassModal';
import { EmptyState } from '../components/common/Loader';
import {
  Boxes,
  LayoutGrid,
  List,
  Filter,
  Plus,
  Trash2,
  Eye,
  Camera,
  Calendar,
  Thermometer,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const InventoryPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedWarehouse,
    setSelectedWarehouse,
    selectedFreshness,
    setSelectedFreshness,
    selectedSort,
    setSelectedSort,
    viewMode,
    setViewMode,
    getFilteredItems,
    addItem,
    deleteItem,
  } = useInventoryStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Fruits');
  const [newItemSupplier, setNewItemSupplier] = useState('');
  const [newItemQty, setNewItemQty] = useState('');

  const items = getFilteredItems();

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!newItemName) return;

    const item = {
      id: 'FBD-' + Math.floor(1000 + Math.random() * 9000),
      name: newItemName,
      category: newItemCat,
      batchId: 'BATCH-2026-' + Math.floor(100 + Math.random() * 900),
      supplier: newItemSupplier || 'Local Farm Direct',
      arrivalDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      warehouse: 'Cold Bay Alpha-1',
      quantity: newItemQty || '100 kg',
      freshnessScore: 95,
      shelfLifeDays: 7,
      status: 'FRESH',
      storageTemp: '3.5°C',
      storageHumidity: '85%',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    };

    addItem(item);
    toast.success(`Added ${item.name} to inventory.`);
    setIsAddModalOpen(false);
    setNewItemName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Boxes className="w-7 h-7 text-emerald-400" /> Food Inventory Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time batch tracking, warehouse allocations, and freshness grades.
          </p>
        </div>

        <GlassButton variant="primary" size="md" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Food Batch
        </GlassButton>
      </div>

      {/* Filter and Control Bar */}
      <GlassCard className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="md:col-span-8 flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="all" className="bg-[#0c1e33]">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-[#0c1e33]">{cat.name}</option>
                ))}
              </select>

              {/* Freshness Status Filter */}
              <select
                value={selectedFreshness}
                onChange={(e) => setSelectedFreshness(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="all" className="bg-[#0c1e33]">All Freshness Grades</option>
                {Object.keys(FRESHNESS_GRADES).map((key) => (
                  <option key={key} value={key} className="bg-[#0c1e33]">{FRESHNESS_GRADES[key].label}</option>
                ))}
              </select>

              {/* Sorting Filter */}
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none"
              >
                <option value="expiry" className="bg-[#0c1e33]">Sort by Expiry Date</option>
                <option value="freshness" className="bg-[#0c1e33]">Sort by Freshness Score</option>
                <option value="name" className="bg-[#0c1e33]">Sort by Name</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'cards' ? 'bg-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-white'
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Content Area */}
      {items.length === 0 ? (
        <EmptyState
          title="No Matching Batches"
          description="Try clearing your category or freshness filters."
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedFreshness('all');
          }}
        />
      ) : viewMode === 'table' ? (
        <GlassCard className="!p-0 overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Food Product</th>
                  <th className="py-3.5 px-4">Batch ID & Supplier</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Warehouse Location</th>
                  <th className="py-3.5 px-4">Freshness Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-semibold text-white block text-sm">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-emerald-300 block">{item.batchId}</span>
                      <span className="text-[10px] text-slate-400">{item.supplier}</span>
                    </td>
                    <td className="py-3 px-4 font-medium">{item.category}</td>
                    <td className="py-3 px-4">{item.warehouse}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{item.freshnessScore}%</span>
                        <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              item.freshnessScore > 80 ? 'bg-emerald-400' : item.freshnessScore > 60 ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${item.freshnessScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/10"
                        title="View Batch Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteItem(item.id);
                          toast.success(`Removed ${item.name}`);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10"
                        title="Delete Batch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <GlassCard key={item.id} className="space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge status={item.status} />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{item.name}</h3>
                <span className="text-xs text-slate-400 block">{item.batchId} • {item.supplier}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Freshness Score</span>
                  <span className="text-emerald-400 font-bold text-base">{item.freshnessScore}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Remaining Days</span>
                  <span className="text-cyan-400 font-bold text-base">{item.shelfLifeDays} Days</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <GlassButton variant="outline" size="sm" className="w-full" onClick={() => setSelectedItem(item)}>
                  Inspect Details
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      <GlassModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Food Batch">
        <form onSubmit={handleAddItemSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Product Name</label>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. Fresh Honeycrisp Apples"
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
              <select
                value={newItemCat}
                onChange={(e) => setNewItemCat(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-100 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#0c1e33]">{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Quantity</label>
              <input
                type="text"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                placeholder="250 kg"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Supplier Name</label>
            <input
              type="text"
              value={newItemSupplier}
              onChange={(e) => setNewItemSupplier(e.target.value)}
              placeholder="Valley Fresh Farms"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:outline-none"
            />
          </div>

          <GlassButton variant="primary" size="lg" className="w-full mt-4">
            Save Batch to Inventory
          </GlassButton>
        </form>
      </GlassModal>

      {/* View Batch Details Modal */}
      {selectedItem && (
        <GlassModal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={`Batch Overview: ${selectedItem.batchId}`}>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-32 h-32 rounded-2xl object-cover border border-white/10" />
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                <p className="text-xs text-emerald-400 font-mono">{selectedItem.id} • {selectedItem.category}</p>
                <p className="text-xs text-slate-300">Supplier: {selectedItem.supplier}</p>
                <div className="pt-2">
                  <Badge status={selectedItem.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/5 p-4 rounded-xl border border-white/10">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Freshness Score</span>
                <span className="text-emerald-400 font-bold text-lg">{selectedItem.freshnessScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Remaining Days</span>
                <span className="text-cyan-400 font-bold text-lg">{selectedItem.shelfLifeDays} Days</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Storage Temp</span>
                <span className="text-white font-bold text-lg">{selectedItem.storageTemp}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Storage Humidity</span>
                <span className="text-white font-bold text-lg">{selectedItem.storageHumidity}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link to="/analysis">
                <GlassButton variant="primary" size="sm" icon={Camera}>
                  Analyze with AI Scan
                </GlassButton>
              </Link>
            </div>
          </div>
        </GlassModal>
      )}
    </div>
  );
};
