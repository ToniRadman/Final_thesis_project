const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');

// POST /api/payment-intent
router.post('/', createPaymentIntent);

module.exports = router;