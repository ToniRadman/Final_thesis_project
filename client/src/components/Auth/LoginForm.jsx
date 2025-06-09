// src/pages/Auth/Login.jsx
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Prijava</h3>
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </Link>
          </div>
          
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email adresa</label>
              <input type="email" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
              <input type="password" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              <Link to="#" className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block">Zaboravili ste lozinku?</Link>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium mb-4">
              Prijavi se
            </button>
            
            <div className="text-center text-sm text-gray-600">
              Nemate račun? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">Registrirajte se</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;