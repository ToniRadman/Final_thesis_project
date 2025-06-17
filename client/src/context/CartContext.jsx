import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Inicijalno učitavanje cartItems iz localStorage ili prazno ako nema
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Spremi cartItems u localStorage kad se promijene
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (item) => {
    const token = localStorage.getItem('token'); // dohvati token

    const res = await fetch(`/api/inventory/part/${item.id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // pošalji token u headeru
      },
    });

    if (!res.ok) {
      alert('Greška pri dohvaćanju zaliha.');
      return;
    }

    const inventoryItem = await res.json();
    const availableQuantity = inventoryItem.quantity;

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      const currentQuantity = existing ? existing.quantity : 0;
      const newQuantity = currentQuantity + item.quantity;

      if (newQuantity > availableQuantity) {
        alert(`Nema dovoljno na skladištu. Dostupno: ${availableQuantity}`);
        return prev;
      }

      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Pretpostavljamo da svaki item ima polje `price` u eurima i quantity
  // Izračun ukupne cijene
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const tax = useMemo(() => subtotal * 0.25, [subtotal]);

  const cartTotal = useMemo(() => subtotal + tax, [subtotal, tax]);

  // Dodajemo i clearCart za brisanje košarice
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, subtotal, tax, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);