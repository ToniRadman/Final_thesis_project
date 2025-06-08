const Joi = require('joi');

const createInventorySchema = Joi.object({
  carId: Joi.number().integer().min(1).optional().allow(null),
  partId: Joi.number().integer().min(1).optional().allow(null),
  quantity: Joi.number().integer().min(0).required(),
});

const updateInventorySchema = Joi.object({
  carId: Joi.number().integer().min(1).optional().allow(null),
  partId: Joi.number().integer().min(1).optional().allow(null),
  quantity: Joi.number().integer().min(0).optional(),
});

module.exports = { createInventorySchema, updateInventorySchema };