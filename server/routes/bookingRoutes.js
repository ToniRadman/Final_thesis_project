const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingsController');
const { createBookingSchema, updateStatusSchema } = require('../validators/bookingValidator');
const { validate } = require('../middleware/validate');

// Kreiranje rezervacije
router.post('/', authenticateToken, authorizeRoles(['KLIJENT', 'ADMIN']), validate(createBookingSchema), createBooking);

// Dohvat rezervacija (klijent vidi samo svoje, zaposlenik i admin sve)
router.get('/', authenticateToken, getBookings);

// Ažuriranje statusa (samo zaposlenik i admin)
router.patch('/:id/status', authenticateToken, authorizeRoles(['ZAPOSLENIK', 'ADMIN']), validate(updateStatusSchema), updateBookingStatus);

// Brisanje rezervacije (admin)
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), deleteBooking);

module.exports = router;