import { useEffect, useState } from 'react';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReservations() {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Greška pri dohvaćanju rezervacija');
        }

        const data = await res.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  if (loading) return <p className="text-center mt-10">Učitavanje rezervacija...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (reservations.length === 0) return <p className="text-center mt-10">Nemate rezervacija.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Moje rezervacije</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Datum</th>
            <th className="border p-2 text-left">Vrsta rezervacije</th>
            <th className="border p-2 text-left">Vozilo</th>
            <th className="border p-2 text-left">Status</th>
            {/* Ako želiš, možeš dodati i korisnika za zaposlenike/admin */}
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border p-2">
                {new Date(r.date).toLocaleString('hr-HR', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </td>
              <td className="border p-2">{r.type}</td>
              <td className="border p-2">{r.car ? `${r.car.make} ${r.car.model}` : 'N/A'}</td>
              <td className="border p-2 capitalize">{r.status.toLowerCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservations;