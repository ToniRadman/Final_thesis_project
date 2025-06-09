// src/components/Reservations/ReservationCalendar.jsx
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ReservationSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Rezervirajte termin</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Kalendar */}
          <div className="md:col-span-2 p-6 border-r border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Kalendar termina</h3>
              <div className="flex space-x-2">
                <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                  <FaChevronLeft />
                </button>
                <span className="px-4 py-2 font-medium">Lipanj 2023</span>
                <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                  <FaChevronRight />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              <div className="text-center font-medium text-gray-500 text-sm">Pon</div>
              <div className="text-center font-medium text-gray-500 text-sm">Uto</div>
              <div className="text-center font-medium text-gray-500 text-sm">Sri</div>
              <div className="text-center font-medium text-gray-500 text-sm">Čet</div>
              <div className="text-center font-medium text-gray-500 text-sm">Pet</div>
              <div className="text-center font-medium text-gray-500 text-sm">Sub</div>
              <div className="text-center font-medium text-gray-500 text-sm">Ned</div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {/* Primjer kalendara - samo vizualni prikaz */}
              <div className="h-12"></div>
              <div className="h-12"></div>
              <div className="h-12"></div>
              <div className="h-12 flex items-center justify-center text-gray-400">1</div>
              <div className="h-12 flex items-center justify-center text-gray-400">2</div>
              <div className="h-12 flex items-center justify-center text-gray-400">3</div>
              <div className="h-12 flex items-center justify-center text-gray-400">4</div>
              
              {/* Tjedan sa dostupnim terminima */}
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">5</div>
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">6</div>
              <div className="h-12 flex items-center justify-center border border-blue-200 bg-blue-50 rounded-md cursor-pointer">7</div>
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">8</div>
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">9</div>
              <div className="h-12 flex items-center justify-center text-gray-400">10</div>
              <div className="h-12 flex items-center justify-center text-gray-400">11</div>
              
              {/* Ostali dani... */}
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">12</div>
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">13</div>
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">14</div>
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">15</div>
              <div className="h-12 flex items-center justify-center border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer">16</div>
              <div className="h-12 flex items-center justify-center text-gray-400">17</div>
              <div className="h-12 flex items-center justify-center text-gray-400">18</div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-bold mb-2">Dostupni termini za 7. Lipanj 2023</h4>
              <div className="grid grid-cols-3 gap-2">
                <button className="py-2 px-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">09:00</button>
                <button className="py-2 px-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">11:00</button>
                <button className="py-2 px-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">13:00</button>
                <button className="py-2 px-3 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed">15:00</button>
                <button className="py-2 px-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">17:00</button>
              </div>
            </div>
          </div>
          
          {/* Detalji rezervacije */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detalji rezervacije</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vrsta usluge</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Probna vožnja</option>
                <option>Pregled vozila prije kupnje</option>
                <option>Servisni pregled</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Odabrano vozilo</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" value="Audi A4 2.0 TDI" readOnly />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum i vrijeme</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" value="7. Lipanj 2023, 13:00" readOnly />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Napomena (opcionalno)</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-md h-24"></textarea>
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition duration-300">
              Potvrdi rezervaciju
            </button>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Nakon potvrde rezervacije, zaposlenik će provjeriti dostupnost i kontaktirati vas u najkraćem mogućem roku.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;