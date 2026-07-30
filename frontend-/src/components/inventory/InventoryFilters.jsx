import { Search, X } from "lucide-react";
import { INVENTORY_CATEGORIES, INVENTORY_STATUSES } from "../../mocks/inventory";
import Button from "../ui/Button";

const SELECT_CLASS =
  "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

/**
 * InventoryFilters — search + category + freshness status filters, with a
 * one-click reset. Fully controlled by the parent InventoryPage.
 */
export default function InventoryFilters({ filters, onChange, onReset, resultCount }) {
  const hasActiveFilters = filters.search || filters.category !== "All" || filters.status !== "All";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by item name or batch ID…"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
      </div>

      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className={SELECT_CLASS}
      >
        <option value="All">All Categories</option>
        {INVENTORY_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className={SELECT_CLASS}
      >
        <option value="All">All Statuses</option>
        {INVENTORY_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" leftIcon={<X size={14} />} onClick={onReset}>
          Clear
        </Button>
      )}

      <span className="hidden shrink-0 text-xs text-slate-400 sm:block">{resultCount} items</span>
    </div>
  );
}
