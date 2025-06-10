// src/pages/Vehicles/Vehicles.jsx
import { useState } from 'react';
import VehicleFilter from '../../components/Vehicles/VehicleFilter';
import VehicleList from '../../components/Vehicles/VehicleList';

const Vehicles = () => {
  const [filters, setFilters] = useState({});

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    // Možeš tu odmah pozvati fetch za filtrirane rezultate ili poslati parametre VehicleListu
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Naslov s većim margin-bottom */}
      <h1 className="text-4xl font-bold mb-12">Pregled vozila</h1> 

      {/* Filter sa svojim paddingom i margin-bottom */}
      <div className="mb-16">
        <VehicleFilter onFilter={handleFilter} />
      </div>

      {/* Lista vozila */}
      <VehicleList filters={filters} />
    </div>
  );
};

export default Vehicles;