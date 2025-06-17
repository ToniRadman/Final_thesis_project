import { FaCreditCard, FaMoneyBillWave, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCheckoutForm } from '../../context/CheckoutContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { formData, setFormData, paymentMethod, setPaymentMethod, resetForm } = useCheckoutForm();

  const stripe = useStripe();
  const elements = useElements();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const deliveryFee = 5.0;
  const cashOnDeliveryFee = 2.0;
  const total = cartTotal + deliveryFee + (paymentMethod === 'CASH' ? cashOnDeliveryFee : 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    required.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'Ovo polje je obavezno';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Ako je kartično plaćanje, Stripe mora biti spreman
      if (paymentMethod === 'CARD' && (!stripe || !elements)) {
        alert('Stripe nije spreman');
        return;
      }

      // Ako je kartica, prvo obradi Stripe plaćanje
      if (paymentMethod === 'CARD') {
        const res = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total })
        });

        const { clientSecret } = await res.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email
            }
          }
        });

        if (result.error) {
          console.error(result.error.message);
          alert('Plaćanje nije uspjelo: ' + result.error.message);
          return;
        }

        if (result.paymentIntent.status !== 'succeeded') {
          alert('Plaćanje nije potvrđeno.');
          return;
        }
      }

      const roundedTotal = Math.round(total * 100) / 100;
      const orderData = {
        customer: formData,
        paymentMethod,
        total: roundedTotal,
        items: cartItems.map((item) => ({
          inventoryId: item.id,
          quantity: item.quantity,
          price: Number(item.price) // Ensure price is a number
        }))
      };

      console.log('Sending order data:', orderData);

      const token = localStorage.getItem('token');
      const saleRes = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      const responseData = await saleRes.json();
      if (!saleRes.ok) {
        console.error('Server response:', responseData);
        throw new Error(responseData.message || 'Greška prilikom slanja narudžbe.');
      }

      // Success case
      clearCart();
      resetForm();
      setErrors({});
      alert('Hvala na kupnji! Narudžba je zaprimljena.');

    } catch (err) {
      console.error('Error details:', err);
      setErrorMessage(err.message || 'Došlo je do greške. Pokušajte ponovno.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Način plaćanja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit}>
          {/* PODACI ZA DOSTAVU */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Podaci za dostavu</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {['firstName', 'lastName'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === 'firstName' ? 'Ime' : 'Prezime'}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                </div>
              ))}
            </div>
            {['email', 'phone', 'address'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {{ email: 'Email', phone: 'Telefon', address: 'Adresa' }[field]}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              {['city', 'postalCode'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === 'city' ? 'Grad' : 'Poštanski broj'}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* NAČIN PLAĆANJA */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Način plaćanja</h2>

            <div className="space-y-4">
              {/* Kartica */}
              <div
                className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'CARD' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onClick={() => setPaymentMethod('CARD')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'CARD' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                    {paymentMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <FaCreditCard className="text-blue-500 mr-2" />
                  <span className="font-medium">Kartica</span>
                </div>
                {paymentMethod === 'CARD' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Podaci o kartici</label>
                    <div className="p-2 border border-gray-300 rounded-md bg-white">
                      <CardElement />
                    </div>
                  </div>
                )}
              </div>

              {/* Pouzeće */}
              <div
                className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'CASH' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onClick={() => setPaymentMethod('CASH')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'CASH' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                    {paymentMethod === 'CASH' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <FaMoneyBillWave className="text-green-500 mr-2" />
                  <span className="font-medium">Pouzeće</span>
                </div>
                {paymentMethod === 'CASH' && (
                  <div className="mt-4 text-sm text-gray-600">
                    Plaćanje prilikom preuzimanja robe. Dodatna naknada: {cashOnDeliveryFee.toFixed(2)} €.
                  </div>
                )}
              </div>
            </div>

            {/* Error message display */}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Greška!</strong>
                <span className="block sm:inline"> {errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={cartTotal === 0 || isLoading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Obrađujem...' : 'Potvrdi narudžbu'}
            </button>
          </div>
        </form>

        {/* SAžETAK */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Sažetak narudžbe</h2>
            <div className="space-y-4 mb-6">
              {cartTotal === 0 ? (
                <div className="text-center text-gray-500">Košarica je prazna.</div>
              ) : (
                <>
                  <div className="flex justify-between font-medium">
                    <span>Cijena proizvoda + PDV</span>
                    <span>{cartTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dostava</span>
                    <span>{deliveryFee.toFixed(2)} €</span>
                  </div>
                  {paymentMethod === 'CASH' && (
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
                </>
              )}
            </div>

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