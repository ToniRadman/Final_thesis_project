// src/components/Vehicles/VehicleCard.jsx
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const VehicleCard = ({ vehicle }) => {
  const statusClasses = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800"
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative">
        <img src={vehicle.image} alt={vehicle.title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{vehicle.title}</h3>
          <span className={`${statusClasses[vehicle.statusColor]} text-xs font-medium px-2.5 py-0.5 rounded`}>
            {vehicle.status}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{vehicle.year} | {vehicle.km} | {vehicle.fuel}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">{vehicle.price}</span>
          <Link to={`/vehicles/${vehicle.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
            Detalji <FaChevronRight className="ml-1 inline" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;