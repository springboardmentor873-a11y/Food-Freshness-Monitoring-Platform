import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    p => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <div className="flex items-center justify-between gap-2 pt-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn-ghost disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => (
          <span key={p} className="flex items-center">
            {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-graphite-400">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-emerald-600 text-white' : 'text-graphite-500 hover:bg-graphite-100 dark:hover:bg-graphite-800'}`}
            >
              {p}
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="btn-ghost disabled:opacity-30"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
