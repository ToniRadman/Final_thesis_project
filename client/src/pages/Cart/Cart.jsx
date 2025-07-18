import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, tax, subtotal } = useCart();

  const [stockMap, setStockMap] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchStock() {
      const stockData = {};
      for (const item of cartItems) {
        const res = await fetch(`/api/inventory/part/${item.id}`,  {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          stockData[item.id] = data.quantity;
        }
      }
      setStockMap(stockData);
    }

    fetchStock();
  }, [cartItems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FaShoppingCart className="mr-2" /> Košarica
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Vaša košarica je prazna</p>
          <Link
            to="/parts"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Pregledajte dijelove
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 font-medium">
                <div className="col-span-5">Proizvod</div>
                <div className="col-span-2 text-center">Cijena</div>
                <div className="col-span-3 text-center">Količina</div>
                <div className="col-span-2 text-right">Ukupno</div>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                  <div className="col-span-5 flex flex-col justify-center">
                    <h3 className="font-medium">{item.name}</h3>
                    {/* Dodatni podaci */}
                    <p className="text-sm text-gray-500 mt-1">Serijski broj: {item.id}</p>
                    <p className="text-sm text-gray-500">Kategorija: {item.category}</p>
                    <p className="text-sm text-gray-500">Dobavljač: {item.supplier}</p>
                  </div>

                  <div className="col-span-2 text-center">{item.price.toFixed(2)} €</div>

                  <div className="col-span-3 flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => {
                          const max = stockMap[item.id] ?? Infinity;
                          if (item.quantity + 1 > max) {
                            alert(`Dostupno na skladištu: ${max}`);
                            return;
                          }
                          updateQuantity(item.id, item.quantity + 1);
                        }}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-end items-center">
                    <span className="font-medium mr-4">{(item.price * item.quantity).toFixed(2)} €</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Sažetak narudžbe</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Međuzbroj:</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>PDV (25%):</span>
                  <span>{tax.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                  <span>Ukupno:</span>
                  <span>{cartTotal.toFixed(2)} €</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-center font-medium"
              >
                Nastavi na plaćanje
              </Link>

              <p className="text-sm text-gray-500 mt-4">
                * Cijene uključuju PDV. Dostava će biti obračunata na stranici za plaćanje.
              </p>
            </div>

            <div className="mt-4 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold mb-2">Promo kod</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Unesite promo kod"
                  className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-md">
                  Primijeni
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;