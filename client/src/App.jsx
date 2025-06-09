// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Home from './pages/Home/Home';
import VehicleDetails from './pages/Vehicles/VehicleDetails';
import Parts from './pages/Parts/Parts';
import Reservations from './pages/Reservations/Reservations';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cart from './pages/Cart/Cart';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<VehicleDetails />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;