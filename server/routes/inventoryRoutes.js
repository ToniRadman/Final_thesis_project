// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} = require('../controllers/inventoryController');
const { createInventorySchema, updateInventorySchema } = require('../validators/inventoryValidator');
const { validate } = require('../middleware/validate');

router.get('/', getAllInventory);
router.get('/:id', getInventoryById);
router.post('/', validate(createInventorySchema), createInventory);
router.put('/:id', validate(updateInventorySchema), updateInventory);
router.delete('/:id', deleteInventory);

module.exports = router;