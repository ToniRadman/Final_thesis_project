import { Link, useNavigate } from 'react-router-dom';
import { FaCar, FaShoppingCart, FaUser, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaUsersCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();  // Dohvati stavke iz košarice
  const navigate = useNavigate();

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const footer = document.getElementById('footer-contact');
    if (footer) footer.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <FaCar className="mr-2" /> AutoPremium
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/vehicles" className="hover:text-blue-200">Vozila</Link>
          {user && <Link to="/parts" className="hover:text-blue-200">Dijelovi</Link>}
          {user && <Link to="/reservations" className="hover:text-blue-200">Rezervacije</Link>}
          {user?.role === 'ADMIN' && (
            <Link to="/user-management" className="hover:text-blue-200 flex items-center space-x-1">
              <FaUsersCog />
              <span>Korisnici</span>
            </Link>
          )}
          <a href="#footer-contact" onClick={handleScrollToContact} className="hover:text-blue-200">Kontakt</a>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.role === 'KLIJENT' && (
                <Link to="/cart" className="hover:text-blue-200 flex items-center relative">
                  <FaShoppingCart />
                  {cartItems.length > 0 && (
                    <span className="ml-1 bg-red-600 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center absolute -top-2 -right-3">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}
              <Link to="/profile" className="hover:text-blue-200 flex items-center space-x-2">
                <FaUser />
                <span>{user.firstName || 'Profil'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-red-300 flex items-center"
              >
                <FaSignOutAlt className="mr-1" /> Odjava
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-200 flex items-center">
              <FaUser />
              <span className="ml-1">Prijava</span>
            </Link>
          )}
          <button className="md:hidden focus:outline-none">
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;