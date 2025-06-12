import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const initialFormState = {
  make: '',
  model: '',
  year: '',
  km: '',
  fuel: '',
  price: '',
  description: '',
  available: true,
  // ako koristiš slike kao URL-eve
  images: [],
};

const VehicleForm = () => {
  const { id } = useParams(); // ako postoji id, onda je edit
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      // Dohvati vozilo za uređivanje
      axios.get(`/api/cars/${id}`)
        .then(res => {
          const car = res.data;
          setFormData({
            make: car.make || '',
            model: car.model || '',
            year: car.year || '',
            km: car.km || '',
            fuel: car.fuel || '',
            price: car.price || '',
            description: car.description || '',
            available: car.available ?? true,
            images: car.images || [],
          });
          setLoading(false);
        })
        .catch(err => {
          setError('Greška pri dohvaćanju vozila');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageAdd = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleImageRemove = index => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (id) {
        // update
        await axios.put(`/api/cars/${id}`, formData);
      } else {
        // create
        await axios.post('/api/cars', formData);
      }
      navigate('/'); // nakon spremanja vraćamo se na listu vozila
    } catch (err) {
      setError('Greška pri spremanju vozila');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Učitavanje podataka...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Uredi vozilo' : 'Dodaj novo vozilo'}</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Marka</label>
          <input
            type="text"
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Godina</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Kilometri</label>
            <input
              type="number"
              name="km"
              value={formData.km}
              onChange={handleChange}
              min="0"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Gorivo</label>
          <input
            type="text"
            name="fuel"
            value={formData.fuel}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Cijena (€)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Opis</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="mr-2"
            />
            Dostupno za rezervaciju
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">Slike (URL)</label>
          {formData.images.map((img, idx) => (
            <div key={idx} className="flex items-center mb-2 space-x-2">
              <input
                type="text"
                value={img}
                onChange={e => handleImageChange(idx, e.target.value)}
                className="flex-grow border px-3 py-2 rounded"
                placeholder="URL slike"
              />
              <button
                type="button"
                onClick={() => handleImageRemove(idx)}
                className="text-red-600 hover:text-red-800 font-bold px-2"
                aria-label="Ukloni sliku"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleImageAdd}
            className="mt-2 text-blue-600 hover:underline"
          >
            Dodaj sliku
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 text-white font-semibold rounded ${
            saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {saving ? 'Spremanje...' : id ? 'Spremi promjene' : 'Dodaj vozilo'}
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;