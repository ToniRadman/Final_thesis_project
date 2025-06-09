import { useEffect, useState } from 'react';
import VehicleCard from './VehicleCard';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch('/api/cars?page=1&pageSize=6') // prilagodi URL ako backend nije na istom portu
      .then(res => res.json())
      .then(data => setVehicles(data.data))
      .catch(err => console.error("Greška prilikom dohvaćanja vozila:", err));
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map(vehicle => (
          <VehicleCard key={vehicle.id} vehicle={{
            id: vehicle.id,
            title: `${vehicle.make} ${vehicle.model}`,
            status: vehicle.status,
            statusColor: vehicle.statusColor,
            year: vehicle.year,
            km: `${vehicle.km.toLocaleString()} km`,
            fuel: vehicle.fuel,
            price: `${vehicle.price.toLocaleString()} €`,
            image: vehicle.image,
            isNew: vehicle.isNew
          }} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/vehicles" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
          Prikaži sva vozila <FaArrowRight className="ml-2 inline" />
        </Link>
      </div>
    </>
  );
};

export default VehicleList;