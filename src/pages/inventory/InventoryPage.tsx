import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodInventoryItem, FoodCategory, FreshnessCategory } from '../../types';
import { 
  Package, 
  PlusCircle, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Thermometer, 
  Droplets,
  X,
  Sparkles
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { 
    inventory, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem, 
    setSelectedInventoryId, 
    setCurrentPage 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodInventoryItem | null>(null);

  // New item form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<FoodCategory>('Vegetables');
  const [formQuantity, setFormQuantity] = useState<number>(20);
  const [formUnit, setFormUnit] = useState('kg');
  const [formBatchId, setFormBatchId] = useState(`BATCH-${Date.now().toString().slice(-6)}`);
  const [formLocation, setFormLocation] = useState('Cold Room Bay 1');
  const [formTemperature, setFormTemperature] = useState(4.5);
  const [formHumidity, setFormHumidity] = useState(85);
  const [formPackaging, setFormPackaging] = useState('Perforated Polybags');
  const [formExpiryDays, setFormExpiryDays] = useState(7);
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80');
  const [formNotes, setFormNotes] = useState('');

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateOrUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + Number(formExpiryDays));

    const freshnessScore = Number(formExpiryDays) >= 6 ? 92 : Number(formExpiryDays) >= 3 ? 78 : 45;
    const freshnessCategory: FreshnessCategory = Number(formExpiryDays) >= 6 ? 'Fresh' : Number(formExpiryDays) >= 3 ? 'Good' : 'Near Spoilage';

    if (editingItem) {
      updateInventoryItem(editingItem.id, {
        name: formName,
        category: formCategory,
        quantity: Number(formQuantity),
        unit: formUnit,
        batchId: formBatchId,
        storageLocation: formLocation,
        temperature: Number(formTemperature),
        humidity: Number(formHumidity),
        packaging: formPackaging,
        remainingDays: Number(formExpiryDays),
        expiryDate: expiry.toISOString().split('T')[0],
        imageUrl: formImageUrl,
        notes: formNotes
      });
      setEditingItem(null);
    } else {
      addInventoryItem({
        name: formName,
        category: formCategory,
        quantity: Number(formQuantity),
        unit: formUnit,
        batchId: formBatchId,
        purchaseDate: today.toISOString().split('T')[0],
        storageDate: today.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        storageLocation: formLocation,
        temperature: Number(formTemperature),
        humidity: Number(formHumidity),
        packaging: formPackaging,
        freshnessScore,
        freshnessCategory,
        remainingDays: Number(formExpiryDays),
        imageUrl: formImageUrl,
        notes: formNotes,
        lastInspected: today.toISOString().split('T')[0],
        status: Number(formExpiryDays) > 2 ? 'In Stock' : Number(formExpiryDays) > 0 ? 'Expiring Soon' : 'Critical'
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormCategory('Vegetables');
    setFormQuantity(20);
    setFormUnit('kg');
    setFormBatchId(`BATCH-${Date.now().toString().slice(-6)}`);
    setFormLocation('Cold Room Bay 1');
    setFormTemperature(4.5);
    setFormHumidity(85);
    setFormPackaging('Perforated Polybags');
    setFormExpiryDays(7);
    setFormImageUrl('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80');
    setFormNotes('');
  };

  const openEditModal = (item: FoodInventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity);
    setFormUnit(item.unit);
    setFormBatchId(item.batchId);
    setFormLocation(item.storageLocation);
    setFormTemperature(item.temperature);
    setFormHumidity(item.humidity);
    setFormPackaging(item.packaging);
    setFormExpiryDays(item.remainingDays);
    setFormImageUrl(item.imageUrl);
    setFormNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  return (
    <div id="inventory-management-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Package className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Food Inventory & Batch Tracking
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage real-time stock levels, batch shelf-life metrics, and storage environmental parameters.
            </p>
          </div>
        </div>

        <button
          id="add-food-btn"
          onClick={() => {
            setEditingItem(null);
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            id="inventory-search-input"
            placeholder="Search produce name, batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy Products">Dairy Products</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInventory.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Package className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p>No inventory items match your current filter.</p>
          </div>
        ) : (
          filteredInventory.map((item) => {
            let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';
            if (item.status === 'Expiring Soon') {
              badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200';
            } else if (item.status === 'Critical') {
              badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200';
            }

            return (
              <div
                key={item.id}
                id={item.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  {/* Image & Status Tag Header */}
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-[10px] font-mono font-bold text-white">
                      {item.batchId}
                    </div>

                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-bold border backdrop-blur-md ${badgeColor}`}>
                      {item.status}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.category} • Location: {item.storageLocation}
                      </div>
                    </div>

                    {/* Quantity & Freshness Score Pill */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium">Stock:</span>
                        <div className="font-extrabold text-slate-800 dark:text-slate-200">
                          {item.quantity} {item.unit}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-medium">Freshness:</span>
                        <div className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                          <Sparkles className="w-3 h-3" />
                          <span>{item.freshnessScore}/100</span>
                        </div>
                      </div>
                    </div>

                    {/* Expiry & Temperature Summary */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.remainingDays} days remaining</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                        <span>{item.temperature}°C ({item.humidity}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                  <button
                    onClick={() => {
                      setSelectedInventoryId(item.id);
                      setCurrentPage('inventory-detail');
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Inspect Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Item"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteInventoryItem(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div 
          id="add-inventory-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div 
            id="add-inventory-modal"
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Edit Inventory Item' : 'Register New Produce Batch'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateItem} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Food Name / Variety
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Crisp Bell Peppers"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as FoodCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy Products">Dairy Products</option>
                    <option value="Meat & Poultry">Meat & Poultry</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Bakery Products">Bakery Products</option>
                    <option value="Packaged Foods">Packaged Foods</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="kg, boxes, units"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Batch ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formBatchId}
                    onChange={(e) => setFormBatchId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Storage Location / Room
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Shelf Life Window (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={formExpiryDays}
                    onChange={(e) => setFormExpiryDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formTemperature}
                    onChange={(e) => setFormTemperature(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    value={formHumidity}
                    onChange={(e) => setFormHumidity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Packaging
                  </label>
                  <input
                    type="text"
                    value={formPackaging}
                    onChange={(e) => setFormPackaging(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Storage Notes
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Notes on supplier, handling, or initial condition..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Register Produce Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
