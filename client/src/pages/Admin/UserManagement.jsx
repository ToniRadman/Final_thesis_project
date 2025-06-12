import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', role: 'KLIJENT', password: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Greška kod dohvaćanja korisnika:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingUser
      ? `http://localhost:5000/api/users/${editingUser.id}`
      : 'http://localhost:5000/api/auth/register';

    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Greška prilikom spremanja.');
        return;
      }

      await fetchUsers();
      setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'KLIJENT', password: '' });
      setEditingUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ ...user, password: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati korisnika?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Greška kod brisanja.');
        return;
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Administracija korisnika</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8 bg-gray-100 p-4 rounded">
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ime" required className="p-2 border rounded" />
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Prezime" required className="p-2 border rounded" />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="p-2 border rounded" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" className="p-2 border rounded" />
        <select name="role" value={formData.role} onChange={handleChange} className="p-2 border rounded">
          <option value="KLIJENT">Klijent</option>
          <option value="ZAPOSLENIK">Zaposlenik</option>
          <option value="ADMIN">Admin</option>
        </select>
        {!editingUser && (
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Lozinka" required className="p-2 border rounded" />
        )}
        <div className="col-span-2 flex gap-4 justify-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingUser ? 'Spremi promjene' : 'Dodaj korisnika'}
          </button>
          {editingUser && (
            <button type="button" onClick={() => {
              setEditingUser(null);
              setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'KLIJENT', password: '' });
            }} className="text-gray-600 hover:underline">
              Odustani
            </button>
          )}
        </div>
      </form>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Ime</th>
            <th className="p-2 border">Prezime</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Telefon</th>
            <th className="p-2 border">Uloga</th>
            <th className="p-2 border">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="p-2 border">{user.firstName}</td>
              <td className="p-2 border">{user.lastName}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.phone}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">Uredi</button>
                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:underline">Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;