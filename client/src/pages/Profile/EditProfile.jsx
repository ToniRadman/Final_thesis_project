import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setFormData({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        phone: parsedUser.phone || '',
      });
    } catch (err) {
      console.error('Greška pri parsiranju korisnika:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const updatedUser = await res.json();

      if (!res.ok) {
        alert(updatedUser.message || 'Greška prilikom spremanja');
        return;
      }

      // Ažuriraj localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert('Profil ažuriran!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Greška na serveru');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Uredi profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Ime</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Prezime</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Telefon (opcionalno)</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Spremi promjene
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:underline"
          >
            Odustani
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;