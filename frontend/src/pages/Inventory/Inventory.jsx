import { useEffect, useState } from "react";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import InventoryStats from "../../components/dashboard/InventoryStats";
import InventoryFilters from "../../components/dashboard/InventoryFilters";
import InventoryTable from "../../components/dashboard/InventoryTable";
import Pagination from "../../components/dashboard/Pagination";
import PageTransition from "../../components/ui/PageTransition";
import InventoryModal from "../../components/modals/InventoryModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import BulkImportModal from "../../components/modals/BulkImportModal";
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventoryItem,
  bulkDeleteInventory,
  bulkImportInventory,
} from "../../services/inventory";
import { Trash2, X, CheckCircle, AlertCircle } from "lucide-react";

function Inventory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 20 });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Delete & Bulk Delete Confirmation
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Checkbox selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Toast Feedback State
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const refreshInventory = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    let active = true;
    getInventory({
      page,
      search: search || undefined,
      category: category || undefined,
    })
      .then((response) => {
        if (active) setData(response);
      })
      .catch((err) => {
        if (active) {
          setToast({
            message: err.response?.data?.detail || "Unable to load inventory records.",
            type: "error",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, search, category, refreshKey]);



  // Handle Save (Add or Edit)
  const handleSaveItem = async (payload, itemId) => {
    if (itemId) {
      await updateInventory(itemId, payload);
      showToast("Inventory item updated successfully!");
    } else {
      await createInventory(payload);
      showToast("New inventory item created successfully!");
    }
    refreshInventory();
  };

  // Handle Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await deleteInventoryItem(itemToDelete);
      showToast("Inventory item deleted.");
      setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete));
      setItemToDelete(null);
      refreshInventory();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Failed to delete inventory item.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Handle Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const res = await bulkDeleteInventory(selectedIds);
      showToast(res.message || `Deleted ${selectedIds.length} items.`);
      setSelectedIds([]);
      setIsBulkConfirmOpen(false);
      refreshInventory();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Failed to bulk delete items.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Handle Bulk Import
  const handleBulkImport = async (file) => {
    const res = await bulkImportInventory(file);
    showToast(`Bulk import finished: ${res.imported_count} imported.`);
    refreshInventory();
    return res;
  };


  // Checkbox select handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = data.items.map((item) => item.id);
    const allPageSelected = pageIds.every((id) => selectedIds.includes(id));

    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* Toast Alert */}
        {toast.message && (
          <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 shadow-xl border text-sm font-semibold transition-all ${
              toast.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : (
              <CheckCircle size={20} className="text-green-600" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ message: "", type: "" })}
              className="ml-2 rounded-lg p-1 hover:bg-black/5"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <DashboardHeader
          title="Global Inventory"
          subtitle="Real-time monitoring of perishable items across facilities."
          button="Add Inventory Item"
          onButtonClick={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          secondaryButton="Import CSV"
          onSecondaryClick={() => setIsImportModalOpen(true)}
        />

        {/* Stats Section */}
        <InventoryStats items={data.items} total={data.total} />

        {/* Search & Filters */}
        <InventoryFilters
          category={category}
          onCategoryChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          search={search}
          total={data.total}
        />

        {/* Bulk Action Bar when items selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-blue-50/80 px-6 py-4 border border-blue-200 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                {selectedIds.length}
              </span>
              <span>Selected item{selectedIds.length > 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Clear Selection
              </button>
              <button
                onClick={() => setIsBulkConfirmOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                <Trash2 size={16} />
                Delete Selected ({selectedIds.length})
              </button>
            </div>
          </div>
        )}

        {/* Table Component */}
        <InventoryTable
          items={data.items}
          loading={loading}
          onEdit={(item) => {
            setEditingItem(item);
            setIsAddModalOpen(true);
          }}
          onDelete={(id) => setItemToDelete(id)}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />

        {/* Pagination Component */}
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.max(1, Math.ceil(data.total / data.page_size))}
        />

        {/* Add & Edit Modal */}
        <InventoryModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          itemToEdit={editingItem}
        />

        {/* Bulk Import Modal */}
        <BulkImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleBulkImport}
        />

        {/* Single Item Delete Confirm Modal */}
        <ConfirmModal
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmSingleDelete}
          title="Delete Inventory Item"
          description="Are you sure you want to delete this food inventory item? This action cannot be undone."
          confirmText="Delete Item"
          loading={deleting}
        />

        {/* Bulk Delete Confirm Modal */}
        <ConfirmModal
          isOpen={isBulkConfirmOpen}
          onClose={() => setIsBulkConfirmOpen(false)}
          onConfirm={handleConfirmBulkDelete}
          title={`Delete ${selectedIds.length} Inventory Items`}
          description={`Are you sure you want to delete all ${selectedIds.length} selected inventory items? This action cannot be undone.`}
          confirmText={`Delete ${selectedIds.length} Items`}
          loading={deleting}
        />
      </div>
    </PageTransition>
  );
}

export default Inventory;
