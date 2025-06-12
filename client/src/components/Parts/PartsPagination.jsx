const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="mt-8 flex justify-center">
      <nav className="inline-flex rounded-md shadow">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          disabled={page === 1}
        >
          &laquo;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-2 border ${
              page === i + 1
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          disabled={page === totalPages}
        >
          &raquo;
        </button>
      </nav>
    </div>
  );
};

export default Pagination;