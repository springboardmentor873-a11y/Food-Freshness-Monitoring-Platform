import { useEffect, useMemo, useState } from "react";
import { Boxes, ScanLine } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import BatchDetailDrawer from "../components/inventory/BatchDetailDrawer";
import { INVENTORY_ITEMS as MOCK_INVENTORY_ITEMS } from "../mocks/inventory";
import { apiService } from "../services/api";

const PAGE_SIZE = 8;

const DEFAULT_FILTERS = { search: "", category: "All", status: "All" };

export default function InventoryPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      setIsLoading(true);
      try {
        const dbItems = await apiService.getInventory(filters);
        if (dbItems && Array.isArray(dbItems) && dbItems.length > 0) {
          const mapped = dbItems.map((item) => ({
            id: String(item.id),
            batchId: item.batch_id || `BATCH-${item.id}`,
            name: item.item_name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit || "items",
            freshnessScore: Math.round(item.freshness_score),
            freshnessCategory: item.freshness_status || item.risk_level || "Fresh",
            location: item.storage_location || "Pantry / Fridge",
            receivedDate: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString(),
            expiryDate: item.expiry_date ? new Date(item.expiry_date).toISOString() : new Date().toISOString(),
            shelfLifeDays: Math.round(item.remaining_shelf_life_days ?? 7),
            storage: {
              temperature: `${item.storage_temperature_c ?? 4.0}°C`,
              humidity: `${item.storage_humidity_pct ?? 85}%`,
            },
            recommendation: item.recommendation,
          }));
          setItems(mapped);
        } else if (filters.search || filters.category !== "All" || filters.status !== "All") {
          setItems([]);
        } else {
          // If DB is completely empty and no filters set, display empty state
          setItems([]);
        }
      } catch (err) {
        console.warn("[InventoryPage] API error fetching inventory:", err);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInventory();
  }, [filters]);

  const filteredItems = items;

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pageItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {items.length} {items.length === 1 ? "item" : "items"} tracked across all locations.
          </p>
        </div>
        <Link to="/app/analyze">
          <Button leftIcon={<ScanLine size={16} />}>Analyze New Item</Button>
        </Link>
      </div>

      <Card padding="md">
        <InventoryFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={() => handleFilterChange(DEFAULT_FILTERS)}
          resultCount={filteredItems.length}
        />
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No inventory items yet"
          description="Analyze a food item or add items to start tracking your inventory freshness."
          action={
            <Link to="/app/analyze">
              <Button leftIcon={<ScanLine size={16} />}>Add / Analyze Item</Button>
            </Link>
          }
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No matching items"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            <Button variant="secondary" onClick={() => handleFilterChange(DEFAULT_FILTERS)}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          <InventoryTable items={pageItems} onSelect={setSelectedItem} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <BatchDetailDrawer item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

