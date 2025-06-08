// routes/serviceRecordRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
} = require('../controllers/serviceRecordController');
const { createServiceRecordSchema } = require('../validators/serviceRecordValidator');
const { validate } = require('../middleware/validate');

router.get('/', getAllServiceRecords);
router.get('/:id', getServiceRecordById);
router.post('/', validate(createServiceRecordSchema), createServiceRecord);
router.put('/:id', updateServiceRecord);
router.delete('/:id', deleteServiceRecord);

module.exports = router;