function Pagination() {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-white px-8 py-6 shadow-sm">

      {/* Previous */}

      <button className="text-gray-400 font-medium hover:text-black">
        ← Previous
      </button>

      {/* Page Numbers */}

      <div className="flex items-center gap-3">

        <button className="h-10 w-10 rounded-xl bg-blue-600 text-white font-semibold">
          1
        </button>

        <button className="h-10 w-10 rounded-xl hover:bg-gray-100">
          2
        </button>

        <button className="h-10 w-10 rounded-xl hover:bg-gray-100">
          3
        </button>

        <span className="text-gray-400">
          ...
        </span>

        <button className="h-10 w-10 rounded-xl hover:bg-gray-100">
          107
        </button>

      </div>

      {/* Next */}

      <button className="font-medium hover:text-blue-600">
        Next →
      </button>

    </div>
  );
}

export default Pagination;