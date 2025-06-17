// src/pages/Home/Home.jsx
import { useEffect, useState } from 'react';
import VehicleList from '../../components/Vehicles/VehicleList';
import PartsList from '../../components/Parts/PartsList';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleScrollToVehicles = (e) => {
    e.preventDefault();
    const vehicleSection = document.getElementById('vehicle-section');
    if (vehicleSection) {
      vehicleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigate = useNavigate();
  const handleReservationClick = () => {
    if (isLoggedIn) {
      navigate('/reservations');
    } else {
      navigate('/login', { state: { from: '/reservations' } });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Pronađite svoje idealno vozilo</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Širok izbor novih i rabljenih vozila uz profesionalno savjetovanje</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a
              href="#"
              onClick={handleScrollToVehicles}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Pregled vozila
            </a>
            <button
              onClick={handleReservationClick}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Rezerviraj termin
            </button>

          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div id="vehicle-section" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Naša ponuda vozila</h2>
        <VehicleList limit={6} />
        <div className="mt-10 text-center">
          <Link to="/vehicles" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
            Prikaži sva vozila <FaArrowRight className="ml-2 inline" />
          </Link>
        </div>
      </div>

      {/* Prikaži dijelove i rezervacije samo ako je korisnik prijavljen */}
      {isLoggedIn && (
        <>
          {/* Parts Section */}
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Dijelovi</h2>
            <PartsList limit={6} />
            <div className="mt-10 text-center">
              <Link to="/parts" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                Prikaži sve dijelove <FaArrowRight className="ml-2 inline" />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;