import { useState, useEffect } from 'react';

const VehicleFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    yearFrom: '',
    yearTo: '',
    priceMin: '',
    priceMax: ''
  });

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    models: {}, // objekt s modelima po marki
    categories: [],
    years: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Učitaj filter opcije
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/cars/filters');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setFilterOptions({
          brands: Array.isArray(data.brands) ? data.brands : [],
          models: typeof data.models === 'object' && data.models !== null ? data.models : {},
          categories: Array.isArray(data.categories) ? data.categories : [],
          years: Array.isArray(data.years) ? data.years : []
        });

        if (data.error) {
          console.warn('Warning from server:', data.error);
        }
      } catch (err) {
        console.error('Greška pri učitavanju filter opcija:', err);
        setError(err.message);

        setFilterOptions({
          brands: [],
          models: {},
          categories: ['SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK', 'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET'],
          years: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Kad se promijeni marka, resetiraj model (jer modeli ovise o marki)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFilters(prev => {
      if (name === 'make') {
        // Promjena marke = resetiraj model
        return {
          ...prev,
          make: value,
          model: ''
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );

    onFilter(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      make: '',
      model: '',
      category: '',
      yearFrom: '',
      yearTo: '',
      priceMin: '',
      priceMax: ''
    };
    setFilters(resetFilters);
    onFilter({});
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Učitavaju se filter opcije...</div>
        </div>
      </div>
    );
  }

  // Dohvati modele za odabranu marku ili prazan niz ako nije odabrana marka
  const availableModels = filters.make && filterOptions.models[filters.make]
    ? filterOptions.models[filters.make]
    : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Filtriraj vozila</h2>

      {error && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800">
            Upozorenje: Greška pri učitavanju nekih filter opcija. Osnovne opcije su dostupne.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Marka */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marka
            </label>
            <select
              name="make"
              value={filters.make}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sve marke</option>
              {filterOptions.brands.map((brand, index) => (
                <option key={`brand-${index}`} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <select
              name="model"
              value={filters.model}
              onChange={handleInputChange}
              disabled={!filters.make}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Svi modeli</option>
              {availableModels.map((model, index) => (
                <option key={`model-${index}`} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Kategorija */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategorija
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sve kategorije</option>
              {filterOptions.categories.map((category, index) => (
                <option key={`category-${index}`} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Godina od */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Godina od
            </label>
            <select
              name="yearFrom"
              value={filters.yearFrom}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Bilo koja</option>
              {filterOptions.years.map((year, index) => (
                <option key={`year-from-${index}`} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Godina do */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Godina do
            </label>
            <select
              name="yearTo"
              value={filters.yearTo}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Bilo koja</option>
              {filterOptions.years.map((year, index) => (
                <option key={`year-to-${index}`} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Cijena od */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cijena od (€)
            </label>
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Cijena do */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cijena do (€)
            </label>
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleInputChange}
              placeholder="999999"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Gumbovi */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Filtriraj
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 transition-colors font-semibold"
          >
            Resetiraj
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilter;