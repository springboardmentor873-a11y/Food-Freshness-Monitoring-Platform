import { useState } from "react";
import { Sparkles } from "lucide-react";
import Button from "../ui/Button";
import { REPORT_TYPES, generateReport } from "../../mocks/reports";
import { INVENTORY_CATEGORIES } from "../../mocks/inventory";

const SELECT_CLASS =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

/**
 * ReportBuilder — select a report type, optional category and date range,
 * then generate {columns, rows} for the preview table and export buttons.
 */
export default function ReportBuilder({ onGenerate }) {
  const [typeId, setTypeId] = useState(REPORT_TYPES[0].id);
  const [category, setCategory] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const selectedType = REPORT_TYPES.find((t) => t.id === typeId);

  const handleGenerate = () => {
    const result = generateReport(typeId, { category, from, to });
    onGenerate({ title: selectedType.label, ...result });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Report Type</label>
        <select value={typeId} onChange={(e) => setTypeId(e.target.value)} className={SELECT_CLASS}>
          {REPORT_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-slate-400">{selectedType.description}</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={SELECT_CLASS}>
          <option value="All">All Categories</option>
          {INVENTORY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={SELECT_CLASS} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={SELECT_CLASS} />
        </div>
      </div>

      <Button className="w-full" leftIcon={<Sparkles size={16} />} onClick={handleGenerate}>
        Generate Report
      </Button>
    </div>
  );
}
