const express = require('express');
const { getVehicleCategories } = require('../controllers/enumsController'); // prilagodi putanju

const router = express.Router();

router.get('/vehicle-categories', getVehicleCategories);

module.exports = router;