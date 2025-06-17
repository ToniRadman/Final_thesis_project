// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Home from './pages/Home/Home';
import VehicleDetails from './pages/Vehicles/VehicleDetails';
import Vehicles from './pages/Vehicles/Vehicles';
import VehicleEdit from './components/Vehicles/VehicleEdit';
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
import Inventory from './pages/Admin/Inventory';
import Analytics from './pages/Admin/Analytics';
import PrivateRoute from './components/Auth/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { CheckoutFormProvider } from './context/CheckoutContext';

import { handleCreateVehicle } from './api/vehicleApi';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <AuthProvider>
      <CheckoutFormProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/vehicles/:id" element={<VehicleDetails />} />

                {/* Autentificirani korisnici */}
                <Route element={<PrivateRoute allowedRoles={['KLIJENT', 'ZAPOSLENIK', 'ADMIN']} />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/parts" element={<Parts />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route
                    path="/checkout"
                    element={
                      <Elements stripe={stripePromise}>
                        <Checkout />
                      </Elements>
                    }
                  />
                </Route>

                {/* Zaposlenici i admini */}
                <Route element={<PrivateRoute allowedRoles={['ZAPOSLENIK', 'ADMIN']} />}>
                  <Route path="/vehicles/new" element={<VehicleForm onSubmit={handleCreateVehicle} />} />
                  <Route path="/vehicles/:id/edit" element={<VehicleEdit />} />
                  <Route path="/parts/new" element={<PartForm />} />
                  <Route path="/parts/:id/edit" element={<PartForm />} />
                  <Route path="/inventory" element={<Inventory />} />
                </Route>

                {/* Samo admin */}
                <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CheckoutFormProvider>
    </AuthProvider>
  );
}

export default App;