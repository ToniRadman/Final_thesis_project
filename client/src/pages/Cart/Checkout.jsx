import { FaCreditCard, FaMoneyBillWave, FaLock, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../context/CartContext'; // Pretpostavka: koristimo custom hook za košaricu

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const deliveryFee = 5.00; // Primjer dostave u eurima
  const cashOnDeliveryFee = 2.00; // Naknada za pouzeće u eurima

  const totalItemsPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = cartTotal + deliveryFee + (paymentMethod === 'cash' ? cashOnDeliveryFee : 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ovdje implementiraj logiku slanja podataka za narudžbu
    console.log('Checkout submitted:', { formData, paymentMethod, cartItems, total });
    clearCart(); // Pošalji narudžbu pa isprazni košaricu
    alert('Hvala na kupnji! Narudžba je zaprimljena.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Način plaćanja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Podaci za dostavu</h2>

            <form>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prezime</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grad</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poštanski broj</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Način plaćanja</h2>

            <div className="space-y-4">
              <div
                className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div className="flex items-center">
                    <FaCreditCard className="text-blue-500 mr-2" />
                    <span className="font-medium">Kartica</span>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Broj kartice</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Datum isteka</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sigurnosni kod (CVC)</label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    paymentMethod === 'cash' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                  }`}>
                    {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-green-500 mr-2" />
                    <span className="font-medium">Pouzeće</span>
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <div className="mt-4 text-sm text-gray-600">
                    Plaćanje prilikom preuzimanja robe. Dodatna naknada za pouzeće iznosi {cashOnDeliveryFee.toFixed(2)} €.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Sažetak narudžbe</h2>

            <div className="space-y-4 mb-6">
              {cartTotal === 0 && (
                <div className="text-center text-gray-500">Košarica je prazna.</div>
              )}

              {cartTotal > 0 && (
                <div className="flex justify-between font-medium">
                  <span>Cijena proizvoda + PDV</span>
                  <span>{cartTotal.toFixed(2)} €</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Dostava</span>
                <span>{deliveryFee.toFixed(2)} €</span>
              </div>

              {paymentMethod === 'cash' && (
                <div className="flex justify-between">
                  <span>Naknada za pouzeće</span>
                  <span>{cashOnDeliveryFee.toFixed(2)} €</span>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Ukupno</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={cartTotal === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Potvrdi narudžbu
            </button>

            <Link to="/cart" className="flex justify-center mt-4 text-red-600 hover:underline">
              <FaTrash className="mr-2" />
              Isprazni košaricu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;