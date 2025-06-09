import { useState } from 'react';

const BookingForm = ({ carId }) => {
  const [formData, setFormData] = useState({
    bookingType: '',
    date: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // prilagodi po potrebi
        },
        body: JSON.stringify({
          carId: Number(carId),
          bookingType: formData.bookingType,
          date: new Date(formData.date),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Greška pri slanju rezervacije');
      }

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ bookingType: '', date: '' });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Rezervacija vozila</h2>

      {submitted ? (
        <div className="text-green-600 text-center">
          <p className="text-4xl mb-2">✓</p>
          <p>Rezervacija uspješno poslana.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600">{error}</p>}

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="bookingType">
              Vrsta rezervacije
            </label>
            <select
              id="bookingType"
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Odaberi vrstu</option>
              <option value="TEST_DRIVE">Testna vožnja</option>
              <option value="INSPECTION">Pregled vozila</option>
              <option value="SERVICE">Servis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="date">
              Datum rezervacije
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Pošalji rezervaciju
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingForm;