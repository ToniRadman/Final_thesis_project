import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F', '#FFBB28', '#FF8042', '#a29bfe', '#fd79a8', '#55efc4'];

const Analytics = () => {
  const [sales, setSales] = useState([]);
  const [period, setPeriod] = useState('mjesec');
  const [popularCars, setPopularCars] = useState([]);
  const [popularParts, setPopularParts] = useState([]);
  const [activeEmployees, setActiveEmployees] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await fetch(`/api/analytics/sales?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const salesData = await salesRes.json();
        console.log('Sales data received:', salesData);
        setSales(salesData.sales || []);

        const carsRes = await fetch('/api/analytics/popular-cars', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const carsData = await carsRes.json();
        setPopularCars(carsData || []);

        const partsRes = await fetch('/api/analytics/popular-parts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const partsData = await partsRes.json();
        setPopularParts(partsData || []);

        const employeesRes = await fetch('/api/analytics/active-employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const employeesData = await employeesRes.json();
        setActiveEmployees(employeesData || []);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchData();
  }, [period, token]);

  // Formatiraj datum - možeš promijeniti prema periodu, ovdje jednostavno lokalni datum
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">📊 Analitika</h1>

      {/* Prodaja po periodu */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Ukupna prodaja ({period})</h2>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="dan">Dnevno</option>
            <option value="tjedan">Tjedno</option>
            <option value="mjesec">Mjesečno</option>
            <option value="godina">Godišnje</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              unit="€"
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip 
              formatter={(value) => [`${value.toFixed(2)} €`, 'Ukupno']}
            />
            <Legend />
            <Line
              type="monotone" 
              dataKey="total" 
              stroke="#8884d8" 
              name="Prodaja"
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Popularna vozila */}
      <section>
        <h2 className="text-xl font-semibold mb-2">🚗 Najpopularnija vozila</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={popularCars.map(item => ({
              name: item.car ? `${item.car.make} ${item.car.model}` : 'Nepoznato vozilo',
              sales: item.quantitySold || 0
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Popularni dijelovi */}
      <section>
        <h2 className="text-xl font-semibold mb-2">🔧 Najprodavaniji dijelovi</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={popularParts.map((item) => ({
                name: item.part?.name || 'Nepoznati dio',
                value: item.quantitySold || 0
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {popularParts.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* Aktivni zaposlenici */}
      <section>
        <h2 className="text-xl font-semibold mb-2">👷 Najaktivniji zaposlenici</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={activeEmployees.map(item => ({
              name: item.employee ? `${item.employee.firstName} ${item.employee.lastName}` : 'Nepoznati zaposlenik',
              count: item.activityCount || 0
            }))}
            margin={{ left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="count" fill="#ff7f50" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Analytics;