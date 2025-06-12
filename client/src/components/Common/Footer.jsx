import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaArrowUp,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

const Footer = () => {
  const { user } = useAuth();
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Prati scroll i pokaži gumb kad je skrolano više od 100px
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-contact" className="relative bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Opis tvrtke */}
          <div>
            <h3 className="text-xl font-bold mb-4">AutoPremium</h3>
            <p className="text-gray-400">
              Vodeći distributer novih i rabljenih vozila u regiji sa više od 15 godina iskustva.
            </p>
          </div>

          {/* Brzi linkovi */}
          <div>
            <h4 className="font-bold mb-4">Brzi linkovi</h4>
            <ul className="space-y-2">
              <li><a href="/vehicles" className="text-gray-400 hover:text-white">Vozila</a></li>
              {user && <li><a href="/parts" className="text-gray-400 hover:text-white">Dijelovi</a></li>}
              {user && <li><a href="/reservations" className="text-gray-400 hover:text-white">Rezervacije</a></li>}
              {user?.role === 'ADMIN' && (
                <li><a href="/user-management" className="text-gray-400 hover:text-white">Administracija</a></li>
              )}
            </ul>
          </div>

          {/* Kontakt informacije */}
          <div>
            <h4 className="font-bold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2" /> Ul. Vukovarska 123, Zagreb
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2" /> +385 1 4567 890
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" /> info@autopremium.hr
              </li>
              <li className="flex items-center mt-4 space-x-4">
                <a href="#" className="hover:text-white"><FaFacebookF /></a>
                <a href="#" className="hover:text-white"><FaInstagram /></a>
                <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>© 2025 Toni Radman. Sva prava pridržana.</p>
        </div>
      </div>

      {/* Gumb za povratak na vrh - prikazuje se samo nakon skrola */}
      {showScrollButton && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
          aria-label="Povratak na vrh"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;