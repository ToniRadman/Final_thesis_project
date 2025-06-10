// components/parts/PartList.jsx
import { useEffect, useState } from 'react';
import { FaCartPlus } from 'react-icons/fa';

const PartList = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9;

  const fetchParts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('pageSize', pageSize);

      const token = localStorage.getItem('token');

      const res = await fetch(`/api/parts?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Greška pri dohvaćanju dijelova: ${res.status}`);
      }

      const data = await res.json();
      setParts(data.data);
      const total = data.total || 0;
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      console.error(err);
      setParts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [page]);

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dijelovi za vozila</h2>

        {loading ? (
          <p>Učitavanje...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map((part) => (
              <div
                key={part.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-bold">{part.name}</h3>
                  <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                    {part.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">Dobavljač: {part.supplier?.name || '-'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    {Number(part.price).toFixed(2)} €
                  </span>
                  <button
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Dodaj <FaCartPlus className="ml-1 inline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginacija */}
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
      </div>
    </div>
  );
};

export default PartList;