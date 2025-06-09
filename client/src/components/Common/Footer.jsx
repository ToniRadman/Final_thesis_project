// src/components/Common/Footer.jsx
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AutoPremium</h3>
            <p className="text-gray-400">Vodeći distributer novih i rabljenih vozila u regiji sa više od 15 godina iskustva.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Brzi linkovi</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Vozila</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Dijelovi</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Servis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">O nama</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Korisnički servis</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Pomoć i podrška</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Česta pitanja</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Uvjeti korištenja</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Pravila privatnosti</a></li>
            </ul>
          </div>
          
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
        
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>© 2023 AutoPremium. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;