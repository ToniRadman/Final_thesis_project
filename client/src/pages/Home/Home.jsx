// src/pages/Home/Home.jsx
import VehicleFilter from '../../components/Vehicles/VehicleFilter';
import VehicleList from '../../components/Vehicles/VehicleList';
import PartsSection from '../../components/Parts/PartsList';
import ReservationSection from '../../components/Reservations/ReservationCalendar';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Pronađite svoje idealno vozilo</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Širok izbor novih i rabljenih vozila uz profesionalno savjetovanje</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300">Pregled vozila</a>
            <a href="#" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300">Rezerviraj probnu vožnju</a>
          </div>
        </div>
      </div>

      {/* Vehicle Filter */}
      <VehicleFilter />

      {/* Vehicle List */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Naša ponuda vozila</h2>
        <VehicleList />
      </div>

      {/* Parts Section */}
      <PartsSection />

      {/* Reservation Section */}
      <ReservationSection />
    </>
  );
};

export default Home;