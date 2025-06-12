import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error('Greška pri parsiranju korisnika:', err);
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6 mb-10">
      <h2 className="text-2xl font-bold mb-4">Profil korisnika</h2>

      <div className="space-y-3">
        <div>
          <strong>Ime:</strong> {user.firstName}
        </div>
        <div>
          <strong>Prezime:</strong> {user.lastName}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        {user.phone && (
          <div>
            <strong>Telefon:</strong> {user.phone}
          </div>
        )}
        {user.role === 'KLIJENT' && !(<div>
          <strong>Uloga:</strong> {user.role}
        </div>)}
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/profile/edit')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Uredi profil
        </button>
      </div>
    </div>
  );
};

export default Profile;