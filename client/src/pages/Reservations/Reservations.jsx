import { useState } from 'react';
import ReservationSection from '../../components/Reservations/ReservationCalendar';
import ReservationList from '../../components/Reservations/ReservationList';

const Reservations = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // 👈 koristimo ovo za osvježavanje

  const handleDateChange = (date) => {
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const handleReservationCreated = () => {
    // Poziva se nakon stvaranja nove rezervacije
    setRefreshKey((prev) => prev + 1); // uzrokuje refetch liste
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Rezervacije</h1>

        <div className="grid grid-cols-1 gap-6">
          <ReservationSection
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onReservationCreated={handleReservationCreated} // 👈 šaljemo callback
          />
          <ReservationList
            selectedDate={selectedDate}
            refreshKey={refreshKey} // 👈 šaljemo key za ponovno učitavanje
          />
        </div>
      </div>
    </div>
  );
};

export default Reservations;