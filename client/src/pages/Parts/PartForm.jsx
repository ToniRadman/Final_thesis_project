import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PartForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ako postoji id, znači edit, inače create

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    supplierId: '',
  });

  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  // Dohvati filtere (posebno dobavljače i kategorije)
  useEffect(() => {
    async function fetchFilters() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('/api/parts/filters', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Greška kod dohvaćanja filtera');
        const data = await res.json();

        setSuppliers(data.suppliers);
        setCategories(data.categories);
      } catch (e) {
        console.error(e);
        setError('Ne mogu dohvatiti filtere');
      } finally {
        setLoading(false);
      }
    }
    fetchFilters();
  }, []);

  // Ako uređujemo, dohvatimo dio prema ID-u i popunimo formu
  useEffect(() => {
    if (!id) return;

    async function fetchPart() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/parts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Dio nije pronađen');
        const data = await res.json();

        setForm({
          name: data.name || '',
          category: data.category || '',
          price: data.price || '',
          supplierId: data.supplierId ? data.supplierId.toString() : '',
        });
      } catch (e) {
        console.error(e);
        setError('Greška kod dohvaćanja dijela');
      } finally {
        setLoading(false);
      }
    }

    fetchPart();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Ime je obavezno';
    if (!form.category.trim()) return 'Kategorija je obavezna';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) return 'Cijena mora biti veći od 0';
    if (!form.supplierId) return 'Dobavljač je obavezan';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        supplierId: form.supplierId,
      };

      const res = await fetch(id ? `/api/parts/${id}` : '/api/parts', {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Greška pri spremanju');
      }

      navigate('/parts'); // Nakon uspješnog spremanja, vraćamo se na listu dijelova
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Učitavanje...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Uredi dio' : 'Dodaj novi dio'}</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Naziv dijela</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block font-medium mb-1">Kategorija</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- odaberi kategoriju --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block font-medium mb-1">Cijena (€)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="supplierId" className="block font-medium mb-1">Dobavljač</label>
          <select
            id="supplierId"
            name="supplierId"
            value={form.supplierId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- odaberi dobavljača --</option>
            {suppliers.map(({ id, name }) => (
              <option key={id} value={id.toString()}>{name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {saving ? 'Spremanje...' : (id ? 'Ažuriraj dio' : 'Dodaj dio')}
        </button>
      </form>
    </div>
  );
};

export default PartForm;