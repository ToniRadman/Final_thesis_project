// src/api/vehicleApi.js

export const handleCreateVehicle = async (payload) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/cars', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Greška pri spremanju vozila');
  }

  return await response.json();
};