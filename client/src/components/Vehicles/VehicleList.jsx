// src/components/Vehicles/VehicleList.jsx
import VehicleCard from './VehicleCard';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const VehicleList = () => {
  const vehicles = [
    {
      id: 1,
      title: "Audi A4 2.0 TDI",
      status: "Dostupno",
      statusColor: "green",
      year: "2023",
      km: "15.000 km",
      fuel: "Dizel",
      price: "32.999 €",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isNew: true
    },
    {
      id: 2,
      title: "BMW 320d",
      status: "Rezervirano",
      statusColor: "yellow",
      year: "2021",
      km: "45.000 km",
      fuel: "Dizel",
      price: "28.500 €",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Mercedes C220d",
      status: "Dostupno",
      statusColor: "green",
      year: "2022",
      km: "22.000 km",
      fuel: "Dizel",
      price: "35.750 €",
      image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map(vehicle => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
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