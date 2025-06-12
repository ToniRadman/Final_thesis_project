import { useState, useEffect } from 'react';

const PartFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    supplierId: '',
    priceMin: '',
    priceMax: '',
    availableOnly: false
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    suppliers: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');
        const response = await fetch('/api/parts/filters', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (!response.ok) throw new Error('Greška pri učitavanju opcija za filtere.');

        const data = await response.json();

        setFilterOptions({
          categories: Array.isArray(data.categories) ? data.categories : [],
          suppliers: Array.isArray(data.suppliers) ? data.suppliers : []
        });
      } catch (err) {
        setError(err.message);
        setFilterOptions({
          categories: ['SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK', 'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET'],
          suppliers: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
    );
    onFilter(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: '',
      category: '',
      supplierId: '',
      priceMin: '',
      priceMax: '',
      availableOnly: false
    };
    setFilters(resetFilters);
    onFilter({});
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Učitavanje filter opcija...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Filtriraj dijelove</h2>

      {error && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
          Greška pri učitavanju filter opcija. Koristim osnovne vrijednosti.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Naziv dijela */}
        <div>
          <label className="block mb-1 text-sm font-medium">Naziv</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Kategorija */}
        <div>
          <label className="block mb-1 text-sm font-medium">Kategorija</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
          >
            <option value="">Sve kategorije</option>
            {filterOptions.categories.map((cat, idx) => (
              <option key={`cat-${idx}`} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Dobavljač */}
        <div>
          <label className="block mb-1 text-sm font-medium">Dobavljač</label>
          <select
            name="supplierId"
            value={filters.supplierId}
            onChange={handleInputChange}
            className="w-full p-3 border rounded"
          >
            <option value="">Svi dobavljači</option>
            {filterOptions.suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cijena od */}
        <div>
          <label className="block mb-1 text-sm font-medium">Cijena od (€)</label>
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handleInputChange}
            min="0"
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Cijena do */}
        <div>
          <label className="block mb-1 text-sm font-medium">Cijena do (€)</label>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleInputChange}
            min="0"
            className="w-full p-3 border rounded"
          />
        </div>

        {/* Dostupnost */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="availableOnly"
            checked={filters.availableOnly}
            onChange={handleInputChange}
          />
          <label className="text-sm">Samo dostupni</label>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Filtriraj
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition"
        >
          Resetiraj
        </button>
      </div>
    </div>
  );
};

export default PartFilter;