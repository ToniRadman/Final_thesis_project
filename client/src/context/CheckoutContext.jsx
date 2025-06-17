import { createContext, useContext, useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'checkoutFormData';
const LOCAL_STORAGE_PAYMENT_METHOD_KEY = 'checkoutPaymentMethod';

const CheckoutFormContext = createContext(null);

export const CheckoutFormProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postalCode: ''
        };
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const savedMethod = localStorage.getItem(LOCAL_STORAGE_PAYMENT_METHOD_KEY);
    return savedMethod || 'CARD'; // default na 'CARD' ili što ti želiš
  });

  // Sync formData u localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Sync paymentMethod u localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PAYMENT_METHOD_KEY, paymentMethod);
  }, [paymentMethod]);

  const resetForm = () => {
    const emptyForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: ''
    };
    setFormData(emptyForm);
    setPaymentMethod('CARD'); // ili default koji želiš
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PAYMENT_METHOD_KEY);
  };

  return (
    <CheckoutFormContext.Provider
      value={{ formData, setFormData, paymentMethod, setPaymentMethod, resetForm }}
    >
      {children}
    </CheckoutFormContext.Provider>
  );
};

export const useCheckoutForm = () => {
  const context = useContext(CheckoutFormContext);
  if (!context) {
    throw new Error('useCheckoutForm must be used within a CheckoutFormProvider');
  }
  return context;
};