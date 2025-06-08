const Joi = require('joi');

const createServiceRecordSchema = Joi.object({
  carId: Joi.number().integer().required(),
  employeeId: Joi.number().integer().required(),
  mechanicId: Joi.number().integer().required(),
  customerId: Joi.number().integer().optional().allow(null),
  description: Joi.string().required(),
  price: Joi.number().precision(2).required(),
  serviceDate: Joi.date().required(),
});

module.exports = { createServiceRecordSchema };