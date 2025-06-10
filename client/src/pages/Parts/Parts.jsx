import { useState } from 'react';
import PartList from '../../components/Parts/PartsList';
import PartsFilter from '../../components/Parts/PartsFilter';

const Parts = () => {
  const [filters, setFilters] = useState({});

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dijelovi</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <PartsFilter onFilter={handleFilter} />
          <div className="md:col-span-3">
            <PartList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parts;