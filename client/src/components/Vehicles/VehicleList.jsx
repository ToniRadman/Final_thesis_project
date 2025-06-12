import { useEffect, useState } from 'react';
import VehicleCard from './VehicleCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VehicleList = ({ filters }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const canAdd = user?.role === 'ZAPOSLENIK' || user?.role === 'ADMIN';

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Ukloni undefined/null vrijednosti iz filtera
        const cleanFilters = Object.fromEntries(
          Object.entries(filters || {}).filter(([_, value]) => 
            value !== undefined && value !== null && value !== ''
          )
        );

        const queryString = new URLSearchParams({
          ...cleanFilters,
          page: 1,
          pageSize: 6
        }).toString();

        const response = await fetch(`/api/cars?${queryString}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data.data)) {
          setVehicles(data.data);
        } else {
          console.warn('Neočekivana struktura podataka:', data);
          setVehicles([]);
        }
      } catch (err) {
        console.error("Greška prilikom dohvaćanja vozila:", err);
        setError(err.message);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg">Učitava vozila...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-600">Greška: {error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Gumb za dodavanje vozila */}
      {canAdd && (
        <div className="flex justify-end mb-6">
          <Link
            to="/vehicles/new"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Dodaj vozilo
          </Link>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Nema vozila koja odgovaraju filtrima.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={{
                id: vehicle.id,
                title: `${vehicle.make} ${vehicle.model}`,
                status: vehicle.status,
                statusColor: vehicle.statusColor,
                year: vehicle.year,
                km: `${vehicle.km?.toLocaleString() || 0} km`,
                fuel: vehicle.fuel,
                price: `${vehicle.price?.toLocaleString() || 0} €`,
                image: vehicle.image,
                isNew: vehicle.isNew
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;