import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const statusOptions = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const ReservationList = ({ refreshKey }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // koristi auth kontekst

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const res = await axios.get('/api/bookings', config);
                setReservations(res.data);
            } catch (err) {
                console.error('Greška pri dohvaćanju rezervacija', err);
                toast.error('Greška pri dohvaćanju rezervacija.');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchReservations();
    }, [user, refreshKey]);


    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.patch(`/api/bookings/${id}/status`, { status: newStatus }, config);
            setReservations((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
            );
            toast.success('Status rezervacije uspješno ažuriran.');
        } catch (err) {
            console.error('Greška pri ažuriranju statusa', err);
            toast.error('Neuspješno ažuriranje statusa.');
        }
    };

    if (loading) return <p>Učitavanje rezervacija...</p>;

    return (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Popis rezervacija</h2>
            {reservations.length === 0 ? (
                <p className="text-gray-500">Nema rezervacija za prikaz.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {reservations.map((res) => (
                        <li key={res.id} className="py-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {res.car.make} {res.car.model} ({res.car.year})
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(res.date).toLocaleString(undefined, {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })} — {res.bookingType}
                                    </p>
                                    {res.customer && (
                                        <p className="text-sm text-gray-500">
                                            Klijent: {res.customer.firstName} {res.customer.lastName}
                                        </p>
                                    )}
                                </div>

                                {user?.role === 'ZAPOSLENIK' || user?.role === 'ADMIN' ? (
                                    <select
                                        value={res.status}
                                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium border ${statusColors[res.status]}`}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[res.status]}`}
                                    >
                                        {res.status}
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReservationList;