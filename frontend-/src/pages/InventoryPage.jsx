import { useMemo, useState } from "react";
import { Boxes, ScanLine } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import InventoryFilters from "../components/inventory/InventoryFilters";
import InventoryTable from "../components/inventory/InventoryTable";
import BatchDetailDrawer from "../components/inventory/BatchDetailDrawer";
import { INVENTORY_ITEMS } from "../mocks/inventory";

const PAGE_SIZE = 8;

const DEFAULT_FILTERS = { search: "", category: "All", status: "All" };

export default function InventoryPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    return INVENTORY_ITEMS.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.batchId.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === "All" || item.category === filters.category;
      const matchesStatus = filters.status === "All" || item.freshnessCategory === filters.status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [filters]);

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
            {INVENTORY_ITEMS.length} batches tracked across all locations.
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

      {filteredItems.length === 0 ? (
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
