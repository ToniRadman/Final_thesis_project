import { useState, useEffect } from 'react';
import { FaCar, FaCalendarAlt, FaGasPump, FaTachometerAlt, FaCogs, FaArrowLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import ReservationForm from '../../components/Reservations/ReservationForm';
import axios from 'axios';

function getStatusColor(available) {
  return available ? 'green' : 'yellow';
}

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Provjera prijave korisnika - postoji li token u localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const res = await axios.get(`/api/cars/${id}`);
        const car = res.data;
        setVehicle({
          ...car,
          available: !car.reservations?.some(r => r.status === 'PENDING' || r.status === 'CONFIRMED'),
          images: car.imagePath ? [car.imagePath] : [],
        });
        if (car.imagePath) setMainImage(car.imagePath);
      } catch (err) {
        console.error(err);
        setError('Greška pri dohvaćanju vozila');
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div>{error}</div>;
  if (!vehicle) return <div>Vozilo nije pronađeno</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FaArrowLeft className="mr-2" /> Natrag na popis vozila
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Slike */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <img
              src={mainImage || '/placeholder-car.jpg'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {vehicle.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`border-2 rounded-md overflow-hidden ${
                  mainImage === img ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img src={img} alt={`thumb_${idx}`} className="w-full h-24 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info o vozilu */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {vehicle.make} {vehicle.model}
          </h1>
          <div className="flex items-center text-gray-600 mb-6">
            <FaCalendarAlt className="mr-1 text-blue-500" />
            <span className="mr-4">{vehicle.year}</span>
            
            <FaTachometerAlt className="mr-1 text-blue-500" />
            <span className="mr-4">{vehicle.kilometers?.toLocaleString() || '—'} km</span>
            
            <FaGasPump className="mr-1 text-blue-500" />
            <span>{vehicle.fuelType || '—'}</span>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {vehicle.price.toLocaleString()} €
            </div>
            <div
              className={`text-sm font-medium px-2.5 py-0.5 rounded-full inline-block ${
                vehicle.available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {vehicle.available ? 'Dostupno za rezervaciju' : 'Trenutno rezervirano'}
            </div>
          </div>

          {/* Tabovi */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
            >
              Detalji
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'features' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
            >
              Oprema
            </button>
          </div>

          {/* Ovisno o tab-u, možeš dodati prikaz detalja i opreme ovdje */}
          {activeTab === 'details' && (
            <div className="mt-4 text-gray-700">
              {/* Detalji vozila, npr. opis, tehnički podaci */}
              <p>{vehicle.description || 'Nema dodatnih detalja.'}</p>
            </div>
          )}
          {activeTab === 'features' && (
            <div className="mt-4 text-gray-700">
              {/* Oprema vozila */}
              <ul className="list-disc list-inside">
                {vehicle.features?.length
                  ? vehicle.features.map((feature, idx) => <li key={idx}>{feature}</li>)
                  : 'Nema podataka o opremi.'}
              </ul>
            </div>
          )}

          {/* Rezervacije & Kontakt */}
          <div className="flex space-x-4 mt-6">
            {isLoggedIn && vehicle.available ? (
              <ReservationForm vehicleId={vehicle.id} disabled={!vehicle.available} />
            ) : (
              <div className="flex-1 p-4 border rounded-md text-center text-gray-500">
                Molimo prijavite se da biste mogli rezervirati vozilo.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;