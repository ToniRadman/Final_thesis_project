// routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllSales,
  getSaleById,
  createSale,
  deleteSale,
} = require('../controllers/saleController');
const { createSaleSchema } = require('../validators/saleValidator');
const { validate } = require('../middleware/validate');

router.use(authenticateToken);

router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.post('/', authorizeRoles('KLIJENT'), validate(createSaleSchema), createSale);
router.delete('/:id', authorizeRoles('ADMIN'), deleteSale);

module.exports = router;