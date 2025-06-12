import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [cars, setCars] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch inventory, cars, parts
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [inventoryRes, carsRes, partsRes] = await Promise.all([
        axios.get('/api/inventory', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/cars', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/parts', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setInventory(inventoryRes.data);
      setCars(carsRes.data);
      setParts(partsRes.data);
    } catch (err) {
      console.error('Greška prilikom dohvaćanja podataka:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      await fetchData();
    } catch (err) {
      console.error('Greška prilikom brisanja inventara:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentItem?.carId && !currentItem?.partId) {
      alert('Odaberi barem vozilo ili dio.');
      return;
    }

    try {
      if (currentItem?.id) {
        await axios.put(`/api/inventory/${currentItem.id}`, currentItem);
      } else {
        await axios.post('/api/inventory', currentItem);
      }
      await fetchData();
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (err) {
      console.error('Greška prilikom spremanja inventara:', err);
    }
  };

  if (loading) return <p className="text-center py-10">Učitavanje inventara...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventar</h1>
        <button
          onClick={() => {
            setCurrentItem({ quantity: 1, carId: null, partId: null });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <FaPlus /> Dodaj
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Naziv</th>
              <th className="px-6 py-3 border-b">Kategorija</th>
              <th className="px-6 py-3 border-b">Godina / Marka</th>
              <th className="px-6 py-3 border-b">Cijena</th>
              <th className="px-6 py-3 border-b">Količina</th>
              <th className="px-6 py-3 border-b">Dostupnost</th>
              <th className="px-6 py-3 border-b">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const isCar = item.car !== null;
              const data = isCar ? item.car : item.part;

              return (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">{data?.name || 'N/A'}</td>
                  <td className="px-6 py-4 border-b">
                    {isCar ? data.category : 'Dijelovi'}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {isCar ? data.year : data.brand || ''}
                  </td>
                  <td className="px-6 py-4 border-b">{data.price} €</td>
                  <td className="px-6 py-4 border-b">{item.quantity}</td>
                  <td className="px-6 py-4 border-b">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      data.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {data.available ? 'Dostupno' : 'Nedostupno'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal forma */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">
              {currentItem?.id ? 'Uredi stavku' : 'Dodaj novu stavku'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                className="w-full border p-2 rounded"
                value={currentItem?.carId || ''}
                onChange={(e) =>
                  setCurrentItem((prev) => ({
                    ...prev,
                    carId: e.target.value ? parseInt(e.target.value) : null,
                    partId: null,
                  }))
                }
              >
                <option value="">-- Odaberi vozilo --</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} ({car.year})
                  </option>
                ))}
              </select>

              <select
                className="w-full border p-2 rounded"
                value={currentItem?.partId || ''}
                onChange={(e) =>
                  setCurrentItem((prev) => ({
                    ...prev,
                    partId: e.target.value ? parseInt(e.target.value) : null,
                    carId: null,
                  }))
                }
              >
                <option value="">-- Odaberi dio --</option>
                {parts.map((part) => (
                  <option key={part.id} value={part.id}>
                    {part.name} ({part.brand})
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Količina"
                value={currentItem?.quantity || ''}
                onChange={(e) =>
                  setCurrentItem((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value),
                  }))
                }
                className="w-full border p-2 rounded"
                required
                min={1}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentItem(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Spremi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;