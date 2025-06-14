// routes/saleRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllSales,
  getSaleById,
  createSale,
  deleteSale,
} = require('../controllers/saleController');
const { createSaleSchema } = require('../validators/saleValidator');
const { validate } = require('../middleware/validate');

router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.post('/', validate(createSaleSchema), createSale);
router.delete('/:id', deleteSale);

module.exports = router;