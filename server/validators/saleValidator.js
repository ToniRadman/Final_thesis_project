const Joi = require('joi');

const createSaleSchema = Joi.object({
  customer: Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required()
  }).required(),

  paymentMethod: Joi.string().valid('CASH', 'CARD').required(),
  total: Joi.number().precision(2).positive().required(),

  items: Joi.array().items(
    Joi.object({
      inventoryId: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().precision(2).positive().required()
    })
  ).min(1).required()
});

module.exports = { createSaleSchema };