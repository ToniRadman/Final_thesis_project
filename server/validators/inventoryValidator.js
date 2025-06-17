const Joi = require('joi');

const updateInventorySchema = Joi.object({
  quantity: Joi.number().integer().min(0).optional(),
});

module.exports = { updateInventorySchema };