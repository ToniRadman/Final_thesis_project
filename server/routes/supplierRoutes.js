// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');
const { createSupplierSchema, updateSupplierSchema } = require('../validators/supplierValidator');
const { validate } = require('../middleware/validate');

router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);
router.post('/', validate(createSupplierSchema), createSupplier);
router.put('/:id', validate(updateSupplierSchema), updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;