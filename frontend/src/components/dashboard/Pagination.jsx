function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-white px-8 py-6 shadow-sm">

      {/* Previous */}

      <button className="text-gray-400 font-medium hover:text-black disabled:opacity-50" disabled={page === 1} onClick={() => setPage(page - 1)} type="button">
        ← Previous
      </button>

      {/* Page Numbers */}

      <div className="flex items-center gap-3">

        <span className="h-10 rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold">{page} / {totalPages}</span>

      </div>

      {/* Next */}

      <button className="font-medium hover:text-blue-600 disabled:opacity-50" disabled={page === totalPages} onClick={() => setPage(page + 1)} type="button">
        Next →
      </button>

    </div>
  );
}

export default Pagination;
