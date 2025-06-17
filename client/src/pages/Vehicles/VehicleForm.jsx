import { useState, useEffect } from 'react';

const fuelOptions = ['Benzin', 'Diesel', 'Hibrid', 'Električni'];
const categoryOptions = [
  'SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK',
  'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET'
];
const statusOptions = ['Dostupno', 'Rezervirano', 'Prodano'];
const currentYear = new Date().getFullYear();

const VehicleForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: '',
    year: '',
    km: '',
    fuel: '',
    price: '',
    status: 'Dostupno',
    imagePath: ''
  });

  const [message, setMessage] = useState('');

  // Kad dođe initialData, popuni formu njime
  useEffect(() => {
    if (initialData) {
      setFormData({
        make: initialData.make || '',
        model: initialData.model || '',
        category: initialData.category || '',
        year: initialData.year ? String(initialData.year) : '',
        km: initialData.km ? String(initialData.km) : '',
        fuel: initialData.fuel || '',
        price: initialData.price ? String(initialData.price) : '',
        status: initialData.status || 'Dostupno',
        imagePath: initialData.imagePath || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      make: formData.make,
      model: formData.model,
      category: formData.category,
      year: Number(formData.year),
      km: formData.km ? Number(formData.km) : null,
      fuel: formData.fuel,
      price: Number(formData.price),
      status: formData.status,
      imagePath: formData.imagePath || null,
    };

    if (payload.year < 1886 || payload.year > currentYear) {
      setMessage('Godina mora biti između 1886 i ' + currentYear);
      return;
    }

    if (payload.price < 0) {
      setMessage('Cijena ne može biti negativna.');
      return;
    }

    try {
      await onSubmit(payload);
      setMessage('Vozilo uspješno spremljeno!');
      if (!initialData) {
        // Ako je dodavanje, resetiraj formu
        setFormData({
          make: '',
          model: '',
          category: '',
          year: '',
          km: '',
          fuel: '',
          price: '',
          status: 'Dostupno',
          imagePath: ''
        });
      }
    } catch (error) {
      console.error(error);
      setMessage('Došlo je do pogreške prilikom spremanja vozila.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">{initialData ? 'Uredi vozilo' : 'Dodaj vozilo'}</h2>

      {/* Ostali inputi kao prije */}
      <input type="text" name="make" placeholder="Marka vozila" value={formData.make} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      <input type="text" name="model" placeholder="Model vozila" value={formData.model} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      <select name="category" value={formData.category} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
        <option value="">-- Odaberi kategoriju --</option>
        {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <input type="number" name="year" placeholder="Godina" value={formData.year} onChange={handleChange} required min="1886" max={currentYear} className="w-full border px-3 py-2 rounded" />
      <div className="relative">
        <input
          type="number"
          name="km"
          placeholder="Kilometraža"
          value={formData.km}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded pr-12"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">km</span>
      </div>
      <select name="fuel" value={formData.fuel} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
        <option value="">-- Odaberi gorivo --</option>
        {fuelOptions.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
      </select>
      <div className="relative">
        <input
          type="number"
          name="price"
          placeholder="Cijena"
          value={formData.price}
          onChange={handleChange}
          onInput={(e) => {
            if (e.target.value < 0) e.target.value = 0;
          }}
          required
          min="0"
          step="0.01"
          className="w-full border px-3 py-2 rounded pr-12"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">€</span>
      </div>
      <select name="status" value={formData.status} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
        {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
      </select>
      <input type="text" name="imagePath" placeholder="URL slike" value={formData.imagePath} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        {initialData ? 'Spremi promjene' : 'Spremi vozilo'}
      </button>

      {message && <p className="text-center text-sm text-green-600">{message}</p>}
    </form>
  );
};

export default VehicleForm;