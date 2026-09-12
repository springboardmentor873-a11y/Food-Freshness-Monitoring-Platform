import { Eye } from "lucide-react";
import { STATUS_COLORS } from "../../mocks/dashboardStats";

function daysLabel(days) {
  if (days <= 0) return "Expired";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

/**
 * InventoryTable — desktop table (md+) with a stacked card layout on mobile,
 * so no data is ever cut off or forced into horizontal scroll on small screens.
 */
export default function InventoryTable({ items, onSelect }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Batch ID</th>
              <th className="px-4 py-3">Freshness</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Shelf Life</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{item.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.category}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{item.batchId}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[item.freshnessCategory]}`}>
                    {item.freshnessCategory} · {item.freshnessScore}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{daysLabel(item.shelfLifeDays)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onSelect(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                  >
                    <Eye size={13} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition-colors hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {item.category} · {item.batchId}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[item.freshnessCategory]}`}>
                {item.freshnessCategory}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>
                {item.quantity} {item.unit}
              </span>
              <span>{daysLabel(item.shelfLifeDays)}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
