import { useState } from "react";
import { X, PackagePlus, Edit3, Thermometer } from "lucide-react";

const CATEGORY_OPTIONS = [
  "Bread",
  "Dairy",
  "Fruits",
  "Vegetables",
  "Meat",
  "Beverage",
  "Other",
];

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getFutureDate = (days = 7) =>
  new Date(Date.now() + days * 86400000).toISOString().split("T")[0];

function InventoryModal({ isOpen, onClose, onSave, itemToEdit }) {
  const isEditing = Boolean(itemToEdit);

  const [foodName, setFoodName] = useState(itemToEdit?.food_name || "");
  const [category, setCategory] = useState(itemToEdit?.category || "Fruits");
  const [quantity, setQuantity] = useState(itemToEdit?.quantity || 1);
  const [purchaseDate, setPurchaseDate] = useState(
    itemToEdit?.purchase_date
      ? itemToEdit.purchase_date.split("T")[0]
      : getTodayDate()
  );
  const [expiryDate, setExpiryDate] = useState(
    itemToEdit?.expiry_date
      ? itemToEdit.expiry_date.split("T")[0]
      : getFutureDate(7)
  );
  const [storageLocation, setStorageLocation] = useState(
    itemToEdit?.storage_location || "Main Refrigerator"
  );
  const [prediction, setPrediction] = useState(itemToEdit?.prediction || "");
  const [confidence, setConfidence] = useState(
    itemToEdit?.confidence != null
      ? (itemToEdit.confidence * 100).toString()
      : ""
  );
  const [freshnessStatus, setFreshnessStatus] = useState(
    itemToEdit?.freshness_status || "fresh"
  );
  const [storageTemperature, setStorageTemperature] = useState(
    itemToEdit?.storage_temperature != null
      ? itemToEdit.storage_temperature.toString()
      : "4.2"
  );
  const [storageHumidity, setStorageHumidity] = useState(
    itemToEdit?.storage_humidity != null
      ? itemToEdit.storage_humidity.toString()
      : "82"
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!foodName.trim()) {
      setError("Food name is required.");
      return;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    if (new Date(expiryDate) < new Date(purchaseDate)) {
      setError("Expiry date cannot be before purchase date.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        food_name: foodName.trim(),
        category,
        quantity: Number(quantity),
        purchase_date: purchaseDate,
        expiry_date: expiryDate,
        storage_location: storageLocation.trim(),
        prediction: prediction.trim() || null,
        confidence: confidence ? Number(confidence) / 100 : null,
        freshness_status: freshnessStatus || null,
        storage_temperature: storageTemperature ? Number(storageTemperature) : 4.2,
        storage_humidity: storageHumidity ? Number(storageHumidity) : 82.0,
      };
      await onSave(payload, itemToEdit?.id);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to save inventory item."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl transition-all">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              {isEditing ? <Edit3 size={24} /> : <PackagePlus size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isEditing ? "Edit Inventory Item" : "Add Inventory Item"}
              </h2>
              <p className="text-sm text-slate-500">
                {isEditing
                  ? "Update item details, IoT telemetry, and location."
                  : "Track new perishables and cold-chain sensor status."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Food Name *
              </label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Fresh Red Apples"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none bg-white"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Quantity (Units) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Storage Location *
              </label>
              <input
                type="text"
                required
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Main Refrigerator Shelf 2"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* IoT Cold-Chain Sensor Telemetry Inputs */}
          <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100">
            <div className="flex items-center gap-1.5 mb-2">
              <Thermometer size={14} className="text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                IoT Cold-Chain Telemetry
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Storage Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={storageTemperature}
                  onChange={(e) => setStorageTemperature(e.target.value)}
                  placeholder="4.2"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Relative Humidity (% RH)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={storageHumidity}
                  onChange={(e) => setStorageHumidity(e.target.value)}
                  placeholder="82"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Purchase Date *
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Expiry Date *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Optional AI Details
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Prediction
                </label>
                <input
                  type="text"
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                  placeholder="fresh_fruits"
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Confidence (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={confidence}
                  onChange={(e) => setConfidence(e.target.value)}
                  placeholder="95.5"
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Status
                </label>
                <select
                  value={freshnessStatus}
                  onChange={(e) => setFreshnessStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs bg-white"
                >
                  <option value="fresh">Fresh</option>
                  <option value="spoiled">Spoiled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : isEditing ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryModal;
