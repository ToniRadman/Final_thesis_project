import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  endOfWeek,
} from 'date-fns';
import { hr } from 'date-fns/locale';

const services = ['Probna vožnja', 'Pregled vozila', 'Servis'];
const availableTimes = ['09:00', '11:00', '13:00', '15:00', '17:00'];

const ReservationForm = ({ carId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(services[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-gray-800">Kalendar termina</h3>
      <div className="flex space-x-2 items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          type="button"
        >
          &lt;
        </button>
        <span className="px-4 py-2 font-medium">{format(currentMonth, 'LLLL yyyy', { locale: hr })}</span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          type="button"
        >
          &gt;
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
    return (
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 text-sm">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const today = new Date();
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = new Date(day);
        const isCurrentMonth = isSameMonth(day, currentMonth);
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        const isPastOrToday = day <= today;
        const isSunday = day.getDay() === 0;
        const isDisabled = isPastOrToday || isSunday;

        days.push(
          <div
            key={day.toISOString()}
            className={`h-12 flex items-center justify-center rounded-md cursor-pointer transition text-sm
            ${!isCurrentMonth
                ? 'text-gray-400'
                : isDisabled
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : isSelected
                    ? 'bg-blue-100 border border-blue-300 text-blue-800'
                    : 'border border-gray-200 hover:bg-blue-50'
              }`}
            onClick={() => {
              if (!isDisabled && isCurrentMonth) {
                setSelectedDate(cloneDay);
                setSelectedTime('');
              }
            }}
          >
            {formattedDate}
          </div>
        );

        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={`row-${day.toISOString()}`}>
          {days}
        </div>
      );
      days = [];
    }

    return <>{rows}</>;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage({ type: 'error', text: 'Molimo odaberite datum i vrijeme.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const bookingDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      Number(selectedTime.split(':')[0]),
      Number(selectedTime.split(':')[1])
    ).toISOString();

    const bookingData = {
      carId,
      bookingType: selectedService,
      date: bookingDateTime,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Došlo je do greške.');
      }

      const data = await res.json();
      setMessage({ type: 'success', text: data.message || 'Rezervacija uspješno kreirana!' });

      setSelectedDate(null);
      setSelectedTime('');
      setSelectedService(services[0]);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Greška pri komunikaciji sa serverom' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Rezervirajte termin</h2>

      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {selectedDate && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">
            Dostupni termini za {format(selectedDate, 'd. LLLL yyyy', { locale: hr })}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2 px-3 rounded-md transition ${selectedTime === time
                    ? 'bg-blue-200 text-blue-900'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                type="button"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 mb-4">
        <label className="block mb-1 font-medium text-gray-700">Vrsta rezervacije</label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        type="button"
      >
        {isSubmitting ? 'Rezerviram...' : 'Rezerviraj'}
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default ReservationForm;