import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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

const ReservationSection = ({ onReservationCreated }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(services[0]);

  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleResults, setVehicleResults] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const inputRef = useRef(null);

  // Dohvat vozila prema unosu
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (vehicleSearch.length < 2) {
        setVehicleResults([]);
        setShowDropdown(false);
        return;
      }

      fetch(`/api/cars?search=${encodeURIComponent(vehicleSearch)}`)
        .then((res) => res.json())
        .then((data) => {
          setVehicleResults(
            data.data.map(v => ({
              ...v,
              name: `${v.make} ${v.model}`,
            }))
          );
          setShowDropdown(true);
        })
        .catch(() => {
          setVehicleResults([]);
          setShowDropdown(false);
        });
    }, 400); // 400ms debounce delay

    return () => clearTimeout(delayDebounce);
  }, [vehicleSearch]);

  // Klik izvan inputa skriva dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onVehicleSelect = (vehicle) => {
    setVehicleSearch(vehicle.name);
    setSelectedVehicle(vehicle);
    setShowDropdown(false);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-gray-800">Kalendar termina</h3>
      <div className="flex space-x-2 items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <FaChevronLeft />
        </button>
        <span className="px-4 py-2 font-medium">{format(currentMonth, 'LLLL yyyy', { locale: hr })}</span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <FaChevronRight />
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

        const isPastOrToday = day <= today; // uključuje i danas
        const isSunday = day.getDay() === 0;
        const isDisabled = isPastOrToday || isSunday;

        days.push(
          <div
            key={day.toISOString()}
            className={`h-12 flex items-center justify-center rounded-md cursor-pointer transition text-sm
              ${
                !isCurrentMonth
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

  // Handler za potvrdu rezervacije
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedVehicle) {
      setMessage({ type: 'error', text: 'Molimo odaberite datum, vrijeme i vozilo.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const bookingData = {
      carId: selectedVehicle.id,
      bookingType: selectedService,
      date: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        Number(selectedTime.split(':')[0]),
        Number(selectedTime.split(':')[1])
      ).toISOString(),
    };

    let data;
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
        const errorData = await res.json().catch(() => ({})); // fallback ako nije JSON
        throw new Error(errorData.message || 'Došlo je do greške.');
      }

      data = await res.json();
      setMessage({ type: 'success', text: data.message || 'Rezervacija uspješno kreirana!' });
      onReservationCreated();

      // Reset forme
      setSelectedDate(null);
      setSelectedTime('');
      setVehicleSearch('');
      setSelectedVehicle(null);
      setSelectedService(services[0]);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Greška pri komunikaciji sa serverom' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Rezervirajte termin</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Kalendar */}
          <div className="md:col-span-2 p-6 border-r border-gray-200">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {selectedDate && (
              <div className="mt-8">
                <h4 className="font-bold mb-2">
                  Dostupni termini za {format(selectedDate, 'd. LLLL yyyy', { locale: hr })}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-md transition ${
                        selectedTime === time
                          ? 'bg-blue-200 text-blue-900'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detalji rezervacije */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detalji rezervacije</h3>

            {/* Dinamički search vozila s mini dropdownom */}
            <div className="mb-6 relative" ref={inputRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Odaberi vozilo</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={vehicleSearch}
                onChange={(e) => {
                  setVehicleSearch(e.target.value);
                  setSelectedVehicle(null); // reset ako korisnik mijenja tekst
                }}
                placeholder="Upiši naziv vozila..."
                autoComplete="off"
                onFocus={() => vehicleResults.length > 0 && setShowDropdown(true)}
              />
              {showDropdown && vehicleResults.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-40 overflow-y-auto mt-1 shadow-md">
                  {vehicleResults.map((v) => (
                    <li
                      key={v.id}
                      className="p-2 cursor-pointer hover:bg-blue-100"
                      onClick={() => onVehicleSelect(v)}
                    >
                      {v.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vrsta usluge</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum i vrijeme</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={
                  selectedDate && selectedTime
                    ? `${format(selectedDate, 'd. LLLL yyyy', { locale: hr })}, ${selectedTime}`
                    : ''
                }
                readOnly
              />
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition duration-300 disabled:opacity-50"
              disabled={!selectedDate || !selectedTime || !selectedVehicle || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Slanje...' : 'Potvrdi rezervaciju'}
            </button>

            {message && (
              <div
                className={`mt-4 p-3 rounded-md ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              <p>
                Nakon potvrde rezervacije, zaposlenik će provjeriti dostupnost i kontaktirati vas u
                najkraćem mogućem roku.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;