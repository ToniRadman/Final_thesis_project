// src/components/Parts/PartsList.jsx
import { FaFilter, FaSearch, FaCartPlus } from 'react-icons/fa';

const PartsSection = () => {
  const parts = [
    {
      id: 1,
      title: "Kočione pločice - Brembo",
      status: "Na stanju",
      statusColor: "green",
      description: "Za Audi A4 B9 (2015-2019)",
      price: "89.99 €"
    },
    {
      id: 2,
      title: "Zračni filter - Mann",
      status: "Na stanju",
      statusColor: "green",
      description: "Za BMW 3 Series F30 (2011-2019)",
      price: "24.50 €"
    },
    {
      id: 3,
      title: "Ulje motora 5W30",
      status: "Nema na stanju",
      statusColor: "red",
      description: "Castrol Edge 4L",
      price: "49.99 €"
    }
  ];

  const statusClasses = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800"
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dijelovi za vozila</h2>
          <div className="flex space-x-4">
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50">
              Filteri <FaFilter className="ml-2 inline" />
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <FaSearch className="inline mr-2" /> Pretraži
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filteri za dijelove */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">Filteri</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ime dijela</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupa vozila</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Sve grupe</option>
                <option>Audi</option>
                <option>BMW</option>
                <option>Mercedes</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cijena (€)</label>
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="Od" className="w-full p-2 border border-gray-300 rounded-md" />
                <span>-</span>
                <input type="number" placeholder="Do" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proizvođač</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Svi proizvođači</option>
                <option>Bosch</option>
                <option>Mann Filter</option>
                <option>Brembo</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dostupnost</label>
              <div className="flex items-center">
                <input id="available" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-700">Samo dostupno</label>
              </div>
            </div>
          </div>
          
          {/* Dijelovi */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parts.map(part => (
                <div key={part.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{part.title}</h3>
                      <span className={`${statusClasses[part.statusColor]} text-xs font-medium px-2.5 py-0.5 rounded`}>
                        {part.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{part.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">{part.price}</span>
                      <button 
                        className={`${part.statusColor === 'red' ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'} font-medium`}
                        disabled={part.statusColor === 'red'}
                      >
                        Dodaj <FaCartPlus className="ml-1 inline" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <a href="#" className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                  <i className="fas fa-chevron-left"></i>
                </a>
                <a href="#" className="px-3 py-2 border-t border-b border-gray-300 bg-white text-blue-600 font-medium">1</a>
                <a href="#" className="px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">2</a>
                <a href="#" className="px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">3</a>
                <a href="#" className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                  <i className="fas fa-chevron-right"></i>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsSection;