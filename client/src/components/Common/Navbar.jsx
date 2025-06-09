// src/components/Common/Navbar.jsx
import { Link } from 'react-router-dom';
import { FaCar, FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <FaCar className="mr-2" /> AutoPremium
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/vehicles" className="hover:text-blue-200">Vozila</Link>
          <Link to="/parts" className="hover:text-blue-200">Dijelovi</Link>
          <Link to="/reservations" className="hover:text-blue-200">Servis</Link>
          <Link to="#" className="hover:text-blue-200">O nama</Link>
          <Link to="#" className="hover:text-blue-200">Kontakt</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="hover:text-blue-200">
            <FaShoppingCart />
            <span className="ml-1">(0)</span>
          </Link>
          <Link to="/login" className="hover:text-blue-200">
            <FaUser />
            <span className="ml-1">Prijava</span>
          </Link>
          <button className="md:hidden focus:outline-none">
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;