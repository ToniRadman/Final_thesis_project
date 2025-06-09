// src/components/Vehicles/VehicleFilter.jsx
const VehicleFilter = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg -mt-10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Marka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
          <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option>Sve marke</option>
            <option>Audi</option>
            <option>BMW</option>
            <option>Mercedes</option>
            <option>Volkswagen</option>
          </select>
        </div>
        
        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option>Svi modeli</option>
            <option>A3</option>
            <option>A4</option>
            <option>3 Series</option>
          </select>
        </div>
        
        {/* Kategorija */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
          <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option>Sve kategorije</option>
            <option>Limuzina</option>
            <option>SUV</option>
            <option>Karavan</option>
          </select>
        </div>
        
        {/* Godina proizvodnje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Godina</label>
          <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option>Sve godine</option>
            <option>2020-2023</option>
            <option>2015-2019</option>
            <option>2010-2014</option>
          </select>
        </div>
        
        {/* Cijena */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cijena (€)</label>
          <div className="flex items-center space-x-2">
            <input type="number" placeholder="Od" className="w-full p-2 border border-gray-300 rounded-md" />
            <span>-</span>
            <input type="number" placeholder="Do" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        
        {/* Dostupnost */}
        <div className="flex items-end">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
            <i className="fas fa-search mr-2"></i> Filtriraj
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilter;