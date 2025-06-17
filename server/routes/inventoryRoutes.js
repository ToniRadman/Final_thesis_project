// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllInventory,
  getInventoryById,
  updateInventory,
  getInventoryByPartId
} = require('../controllers/inventoryController');
const { updateInventorySchema } = require('../validators/inventoryValidator');
const { validate } = require('../middleware/validate');

router.use(authenticateToken);

router.get('/', getAllInventory);
router.get('/:id', getInventoryById);
router.get('/part/:id', getInventoryByPartId);
router.put('/:id', validate(updateInventorySchema), updateInventory);

module.exports = router;