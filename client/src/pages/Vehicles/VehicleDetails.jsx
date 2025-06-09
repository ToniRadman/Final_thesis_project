import { useState } from 'react';
import { FaCar, FaCalendarAlt, FaGasPump, FaTachometerAlt, FaCogs, FaArrowLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import ReservationForm from '../../components/Reservations/ReservationForm';

const VehicleDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  
  // Mock data - in a real app this would come from an API
  const vehicle = {
    id: id,
    brand: 'Audi',
    model: 'A4 2.0 TDI',
    year: 2023,
    price: 32999,
    mileage: 15000,
    fuelType: 'Dizel',
    power: '190 KS',
    transmission: 'Automatski',
    color: 'Crna',
    doors: 4,
    available: true,
    isNew: true,
    description: 'Audi A4 2.0 TDI je premium limuzina koja kombinira sportski dizajn s vrhunskom udobnošću. Opremljen snažnim 2.0 TDI motorom od 190 KS, ovaj automobil nudi izuzetne performanse uz nisku potrošnju goriva.',
    features: [
      'Automatski klima uređaj',
      'Kožna sjedala',
      'Navigacija',
      'Parking senzori',
      'LED svjetla',
      'Kamera za vožnju unatrag'
    ],
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ]
  };

  const [mainImage, setMainImage] = useState(vehicle.images[0]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FaArrowLeft className="mr-2" /> Natrag na popis vozila
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Vehicle Images */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <img 
              src={mainImage} 
              alt={`${vehicle.brand} ${vehicle.model}`} 
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {vehicle.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setMainImage(img)}
                className={`border-2 rounded-md overflow-hidden ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`}
              >
                <img 
                  src={img} 
                  alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`} 
                  className="w-full h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Vehicle Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{vehicle.brand} {vehicle.model}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <FaCalendarAlt className="mr-1 text-blue-500" />
            <span className="mr-4">{vehicle.year}</span>
            
            <FaTachometerAlt className="mr-1 text-blue-500" />
            <span className="mr-4">{vehicle.mileage.toLocaleString()} km</span>
            
            <FaGasPump className="mr-1 text-blue-500" />
            <span>{vehicle.fuelType}</span>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{vehicle.price.toLocaleString()} €</div>
            <div className={`text-sm font-medium px-2.5 py-0.5 rounded-full inline-block ${
              vehicle.available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {vehicle.available ? 'Dostupno za probnu vožnju' : 'Trenutno rezervirano'}
            </div>
          </div>
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Detalji
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 font-medium ${activeTab === 'features' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Oprema
            </button>
          </div>
          
          {activeTab === 'details' ? (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{vehicle.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Marka</div>
                  <div className="font-medium">{vehicle.brand}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Model</div>
                  <div className="font-medium">{vehicle.model}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Godina</div>
                  <div className="font-medium">{vehicle.year}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Kilometraža</div>
                  <div className="font-medium">{vehicle.mileage.toLocaleString()} km</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Gorivo</div>
                  <div className="font-medium">{vehicle.fuelType}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Snaga</div>
                  <div className="font-medium">{vehicle.power}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Mjenjač</div>
                  <div className="font-medium">{vehicle.transmission}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Boja</div>
                  <div className="font-medium">{vehicle.color}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <ul className="grid grid-cols-2 gap-2">
                {vehicle.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <FaCogs className="text-blue-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition duration-300">
              Rezerviraj probnu vožnju
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition duration-300">
              Kontaktiraj prodavača
            </button>
          </div>
        </div>
      </div>
      
      {/* Reservation Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Rezerviraj termin</h2>
        <ReservationForm vehicleId={vehicle.id} />
      </div>
    </div>
  );
};

export default VehicleDetails;