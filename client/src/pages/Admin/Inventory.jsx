import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch (err) {
      console.error('Greška prilikom dohvaćanja inventara:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setCurrentItem({ id: item.id, quantity: item.quantity });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    console.log('Submitting quantity:', currentItem.quantity);
    e.preventDefault();
    try {
      await axios.put(
        `/api/inventory/${currentItem.id}`,
        { quantity: currentItem.quantity }, // data
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchData();
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (err) {
      console.error('Greška prilikom ažuriranja količine:', err);
    }
  };

  if (loading) return <p className="text-center py-10">Učitavanje inventara...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventar</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Naziv</th>
              <th className="px-6 py-3 border-b">Kategorija</th>
              <th className="px-6 py-3 border-b">Godina</th>
              <th className="px-6 py-3 border-b">Cijena</th>
              <th className="px-6 py-3 border-b">Količina</th>
              <th className="px-6 py-3 border-b">Stanje</th>
              <th className="px-6 py-3 border-b">Uredi</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const isCar = item.car !== null;
              const data = isCar ? item.car : item.part;

              const naziv = isCar ? `${data.make} ${data.model}` : data.name;
              const kategorija = isCar ? data.category : 'Dijelovi';
              const oznaka = isCar ? data.year : data.brand;
              const cijena = data.price;

              const quantity = Number(item.quantity);

              return (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">{naziv}</td>
                  <td className="px-6 py-4 border-b">{kategorija}</td>
                  <td className="px-6 py-4 border-b">{oznaka}</td>
                  <td className="px-6 py-4 border-b">{cijena} €</td>
                  <td className="px-6 py-4 border-b">{quantity}</td>
                  <td className="px-6 py-4 border-b">
                    {quantity > 5 && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                        Na skladištu
                      </span>
                    )}
                    {quantity > 0 && quantity <= 5 && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">
                        Ograničena zaliha
                      </span>
                    )}
                    {quantity === 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full">
                        Nema na skladištu
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Uredi količinu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="Količina"
                value={currentItem?.quantity ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentItem((prev) => ({
                    ...prev,
                    quantity: val === '' ? 0 : parseInt(val, 10),
                  }));
                }}
                className="w-full border p-2 rounded"
                required
                min={0}
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