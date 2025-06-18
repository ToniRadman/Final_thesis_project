import { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Dohvati userId iz JWT tokena (pretpostavlja standardni payload)
function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    return payload.userId || payload.id || null;
  } catch {
    return null;
  }
}

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const userId = getUserIdFromToken();
  const storageKey = `cartItems-${userId}`;

  // Učitaj košaricu za korisnika
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Spremi košaricu kad se promijeni
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const addToCart = async (item) => {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/inventory/part/${item.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(storageKey); // Očisti i iz localStorage
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const tax = useMemo(() => subtotal * 0.25, [subtotal]);
  const cartTotal = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        subtotal,
        tax,
        cartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);