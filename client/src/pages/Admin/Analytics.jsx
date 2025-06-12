import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F', '#FFBB28', '#FF8042', '#a29bfe', '#fd79a8', '#55efc4'];

const Analytics = () => {
  const [sales, setSales] = useState([]);
  const [period, setPeriod] = useState('month');
  const [popularCars, setPopularCars] = useState([]);
  const [popularParts, setPopularParts] = useState([]);
  const [activeEmployees, setActiveEmployees] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`/api/analytics/sales?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSales(data.sales || []));

    fetch('/api/analytics/popular-cars', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPopularCars(data || []));

    fetch('/api/analytics/popular-parts', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPopularParts(data || []));

    fetch('/api/analytics/active-employees', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setActiveEmployees(data || []));
  }, [period]);

  const formatDate = (isoString) => new Date(isoString).toLocaleDateString();

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
            <option value="day">Dnevno</option>
            <option value="week">Tjedno</option>
            <option value="month">Mjesečno</option>
            <option value="year">Godišnje</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sales.map(s => ({ date: formatDate(s.saleDate), total: s._sum.totalPrice }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis unit="€" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Popularna vozila */}
      <section>
        <h2 className="text-xl font-semibold mb-2">🚗 Najpopularnija vozila</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={popularCars.map(item => ({
              name: `${item.car?.make} ${item.car?.model}`,
              sales: item.salesCount
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
              data={popularParts.map((item, index) => ({
                name: item.part?.name,
                value: item.salesCount
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
              name: `${item.employee?.firstName} ${item.employee?.lastName}`,
              count: item.activityCount
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