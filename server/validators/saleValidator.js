const Joi = require('joi');

const createSaleSchema = Joi.object({
  carId: Joi.number().integer().optional().allow(null),
  partId: Joi.number().integer().optional().allow(null),
  employeeId: Joi.number().integer().optional().allow(null),
  customerId: Joi.number().integer().required(),
  saleDate: Joi.date().required(),
  totalPrice: Joi.number().precision(2).required(),
  wayOfPayment: Joi.number().integer().required(),
});

module.exports = { createSaleSchema };