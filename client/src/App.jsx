// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Home from './pages/Home/Home';
import VehicleDetails from './pages/Vehicles/VehicleDetails';
import Vehicles from './pages/Vehicles/Vehicles';
import VehicleForm from './pages/Vehicles/VehicleForm';
import Parts from './pages/Parts/Parts';
import PartForm from './pages/Parts/PartForm';
import Reservations from './pages/Reservations/Reservations';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import Checkout from './pages/Cart/Checkout';
import UserManagement from './pages/Admin/UserManagement';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/new" element={<VehicleForm />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/parts/new" element={<PartForm />} />
            <Route path="/parts/:id/edit" element={<PartForm />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/user-management" element={<UserManagement />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;