const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const partRoutes = require('./routes/partRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const saleRoutes = require('./routes/saleRoutes');
const serviceRecordRoutes = require('./routes/serviceRecordRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const bookingsRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth rute (registracija, login)
app.use('/api/auth', authRoutes);

// User rute (profile, admin-data itd.)
app.use('/api/users', userRoutes);

app.use('/api/cars', carRoutes);

app.use('/api/parts', partRoutes);

app.use('/api/suppliers', supplierRoutes);

app.use('/api/sales', saleRoutes);

app.use('/api/service-records', serviceRecordRoutes);

app.use('/api/inventory', inventoryRoutes);

app.use('/api/bookings', bookingsRoutes);

app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});