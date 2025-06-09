// routes/serviceRecordRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  deleteServiceRecord,
} = require('../controllers/serviceRecordController');
const { createServiceRecordSchema } = require('../validators/serviceRecordValidator');
const { validate } = require('../middleware/validate');

router.get('/', getAllServiceRecords);
router.get('/:id', getServiceRecordById);
router.post('/', validate(createServiceRecordSchema), createServiceRecord);
router.delete('/:id', deleteServiceRecord);

module.exports = router;