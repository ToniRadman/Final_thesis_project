const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN')); // Samo admin ima pristup analitici

router.get('/sales', analyticsController.getSalesByPeriod);
router.get('/popular-cars', analyticsController.getPopularCars);
router.get('/popular-parts', analyticsController.getPopularParts);
router.get('/active-employees', analyticsController.getActiveEmployees);

module.exports = router;