import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Neuspješna prijava');
        return;
      }
      login(data.user, data.token); // ← ažurira kontekst i localStorage
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert('Greška prilikom slanja zahtjeva');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Prijava</h2>
      <form onSubmit={handleSubmit}>
        {/* ... tvoj postojeći JSX za formu ... */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email adresa</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">Lozinka</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="text-right mt-1">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Zaboravili ste lozinku?</Link>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition duration-300"
        >
          Prijavi se
        </button>
        <div className="mt-4 text-center text-sm text-gray-600">
          Nemate račun?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">Registrirajte se</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;