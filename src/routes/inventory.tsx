import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Download, Boxes } from "lucide-react";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — FreshTrack" },
      { name: "description", content: "Track every food batch by category, expiry, freshness, and status in a beautiful, filterable data grid." },
      { property: "og:title", content: "FreshTrack Inventory" },
      { property: "og:description", content: "Track every food batch by category, expiry, freshness, and status." },
    ],
  }),
  component: InventoryPage,
});

type Row = {
  id: string; item: string; category: string; batch: string;
  qty: number; unit: string; freshness: number; shelf: number; status: "Fresh" | "At risk" | "Expired";
  updated: string;
};

const seed: Row[] = [];
const categories = ["All", "Produce", "Dairy", "Meat", "Bakery"] as const;

function InventoryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(
    () => seed.filter((r) =>
      (cat === "All" || r.category === cat) &&
      (r.item.toLowerCase().includes(q.toLowerCase()) || r.batch.toLowerCase().includes(q.toLowerCase())),
    ),
    [q, cat],
  );

  return (
    <section className="py-14 lg:py-20">
      <div className="container-page">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">Inventory</div>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Every batch, one grid.</h1>
            <p className="mt-2 max-w-xl text-[15px] text-ink-muted">Filter, search, and act on your live inventory.</p>
          </div>
          <button className="inline-flex items-center gap-2 self-start rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background md:self-auto">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-surface shadow-elegant">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
              <Search className="h-4 w-4 text-ink-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search item or batch"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-full border border-border bg-background p-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-3 py-1.5 text-xs ${cat === c ? "bg-foreground text-background" : "text-ink-muted hover:text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs text-ink-muted">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>
          </div>

          <div className="grid place-items-center px-6 py-24 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary-dark">
              <Boxes className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold">No inventory yet</h3>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              {filtered.length === 0 && (q || cat !== "All")
                ? "Nothing matches your filters."
                : "Analyzed batches will appear here once you start scanning items."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
