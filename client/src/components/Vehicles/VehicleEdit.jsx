import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleForm from '../../pages/Vehicles/VehicleForm';

const VehicleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const res = await axios.get(`/api/cars/${id}`);
        setVehicleData(res.data);
      } catch (err) {
        setError('Ne mogu dohvatiti podatke vozila.');
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  const handleSubmit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/cars/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Vozilo je uspješno uređeno.');
      navigate(`/vehicles/${id}`); // vrati na detalje vozila
    } catch (err) {
      alert('Greška pri spremanju promjena.');
      console.error(err);
    }
  };

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div>{error}</div>;

  return <VehicleForm initialData={vehicleData} onSubmit={handleSubmit} />;
};

export default VehicleEdit;