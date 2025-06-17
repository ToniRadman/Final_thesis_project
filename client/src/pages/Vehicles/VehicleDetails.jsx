import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaGasPump, FaTachometerAlt, FaArrowLeft } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReservationForm from '../../components/Reservations/ReservationForm';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { user } = useAuth();
  const canEdit = user?.role === 'ZAPOSLENIK' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'ADMIN';


  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const res = await axios.get(`/api/cars/${id}`);
        const car = res.data;
        setVehicle(car);
        if (car.images?.length > 0) setMainImage(car.images[0]);
      } catch (err) {
        console.error(err);
        setError('Greška pri dohvaćanju vozila');
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovo vozilo?')) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`/api/cars/${id}`, config);
      alert('Vozilo je uspješno obrisano.');
      navigate('/'); // vraćanje na listu vozila
    } catch (err) {
      console.error(err);
      alert('Greška prilikom brisanja vozila.');
    }
  }

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div>{error}</div>;
  if (!vehicle) return <div>Vozilo nije pronađeno</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FaArrowLeft className="mr-2" /> Natrag na popis vozila
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Slike */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <img
              src={mainImage || '/placeholder-car.jpg'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-72 object-contain"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {vehicle.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`border-2 rounded-md overflow-hidden ${mainImage === img ? 'border-blue-500' : 'border-transparent'
                  }`}
              >
                <img src={img} alt={`thumb_${idx}`} className="w-full h-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Glavni info */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">
                {vehicle.make} {vehicle.model}
              </h1>

              <div className="space-x-2">
                {canEdit && (
                  <button
                    onClick={() => navigate(`/vehicles/${id}/edit`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md"
                  >
                    Uredi
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Obriši
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6 space-x-6">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-1 text-blue-500" />
                <span>{vehicle.year}</span>
              </div>
              <div className="flex items-center">
                <FaTachometerAlt className="mr-1 text-blue-500" />
                <span>{vehicle.km?.toLocaleString() || '—'} km</span>
              </div>
              <div className="flex items-center">
                <FaGasPump className="mr-1 text-blue-500" />
                <span>{vehicle.fuel || '—'}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 max-w-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {vehicle.price.toLocaleString()} €
              </div>
              <div
                className={`text-sm font-medium px-2.5 py-0.5 rounded-full inline-block ${vehicle.available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
              >
                {vehicle.available ? 'Dostupno za rezervaciju' : 'Trenutno rezervirano'}
              </div>
            </div>

            <div className="mt-4 text-gray-700 max-w-3xl">
              <h2 className="text-xl font-semibold mb-2">Detalji vozila</h2>
              <p>{vehicle.description || 'Nema dodatnih detalja.'}</p>
            </div>
          </div>

          <div className="mt-8">
            {isLoggedIn ? (
              vehicle.available ? (
                <ReservationForm carId={vehicle.id} />
              ) : (
                <div className="p-4 border rounded-md text-center text-gray-500">
                  Vozilo je trenutno rezervirano. Molimo pokušajte kasnije.
                </div>
              )
            ) : (
              <div className="p-4 border rounded-md text-center text-gray-500">
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