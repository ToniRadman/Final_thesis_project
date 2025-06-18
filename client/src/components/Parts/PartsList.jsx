import { useEffect, useState } from 'react';
import { FaCartPlus, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Pagination from '../Pagination/Pagination';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PartList = ({ filters = {}, limit }) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useAuth();
  const canAdd = user?.role === 'ZAPOSLENIK' || user?.role === 'ADMIN';
  const canEdit = user?.role === 'ZAPOSLENIK' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'ADMIN';

  const navigate = useNavigate();
  const isPaginated = !limit;
  const pageSize = limit || 9;

  const fetchParts = async (signal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      params.append('page', isPaginated ? page : 1);
      params.append('pageSize', pageSize);

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const token = localStorage.getItem('token');
      const url = `/api/parts?${params.toString()}`;

      console.log('🔍 Fetching:', url);

      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (!res.ok) throw new Error(`Greška pri dohvaćanju dijelova: ${res.status}`);

      const data = await res.json();
      setParts(data.data);

      if (isPaginated) {
        const total = data.total || 0;
        setTotalPages(Math.ceil(total / pageSize));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('❌ Fetch greška:', err.message);
        setParts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchParts(controller.signal);
    return () => controller.abort();
  }, [page, limit, JSON.stringify(filters)]);

  const { addToCart } = useCart();

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj dio?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/parts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Greška pri brisanju dijela');

      fetchParts();
    } catch (error) {
      alert(error.message || 'Greška pri brisanju dijela');
    }
  };

  return (
    <div>
      { canAdd && (<div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/parts/new')}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          <FaPlus className="mr-2" /> Dodaj novi dio
        </button>
      </div>)}

      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map((part) => (
            <div
              key={part.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition relative"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-bold">{part.name}</h3>
                <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                  {part.category}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">Serijski broj: {part.id}</p>

              {/* Ikonice za edit i delete u novom retku sa margin-top */}
              <div className="flex space-x-3 mb-3">
                {canEdit && (<button
                  onClick={() => navigate(`/parts/${part.id}/edit`)}
                  title="Uredi dio"
                  className="text-blue-600 hover:text-blue-800 text-lg"
                >
                  <FaEdit />
                </button>)}
                {canDelete && (<button
                  onClick={() => handleDelete(part.id)}
                  title="Obriši dio"
                  className="text-red-600 hover:text-red-800 text-lg"
                >
                  <FaTrash />
                </button>)}
              </div>

              <p className="text-gray-600 mb-1">Dobavljač: {part.supplier?.name || '-'}</p>

              <p className={`mb-4 font-semibold ${part.available ? 'text-green-600' : 'text-red-600'}`}>
                {part.available ? 'Dostupno na skladištu' : 'Nema na skladištu'}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">
                  {Number(part.price).toFixed(2)} €
                </span>
                <button
                  className={`font-medium flex items-center ${
                    part.available
                      ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() =>
                    part.available && addToCart({
                      id: Number(part.id),
                      name: part.name,
                      price: parseFloat(part.price),
                      quantity: 1,
                      category: part.category,
                      supplier: part.supplier?.name || 'Nepoznato',
                    })
                  }
                  disabled={!part.available}
                  title="Dodaj u košaricu"
                >
                  Dodaj <FaCartPlus className={`ml-1 inline ${part.available ? '' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPaginated && totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </div>
  );
};

export default PartList;