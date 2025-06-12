// src/pages/reservations/index.jsx
import ReservationSection from '../../components/Reservations/ReservationCalendar';

const Reservations = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Rezervacije</h1>
        <div className="grid grid-cols-1">
          <ReservationSection />
        </div>
      </div>
    </div>
  );
};

export default Reservations;