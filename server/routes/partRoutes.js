// routes/parts.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
} = require('../controllers/partController');
const { createPartSchema, updatePartSchema } = require('../validators/partValidator');
const { validate } = require('../middleware/validate');

router.use(authenticateToken);

router.get('/', getAllParts);
router.get('/:id', getPartById);

router.post('/', authorizeRoles('ZAPOSLENIK', 'ADMIN'), validate(createPartSchema), createPart);
router.put('/:id', authorizeRoles('ZAPOSLENIK', 'ADMIN'), validate(updatePartSchema), updatePart);
router.delete('/:id', authorizeRoles('ADMIN'), deletePart);

module.exports = router;