const Joi = require('joi');

const createPartSchema = Joi.object({
  name: Joi.string().required(),
  group: Joi.number().integer().required(),
  price: Joi.number().precision(2).required(),
  supplierId: Joi.number().integer().required(),
});

const updatePartSchema = Joi.object({
  name: Joi.string().optional(),
  group: Joi.number().integer().optional(),
  price: Joi.number().precision(2).optional(),
  supplierId: Joi.number().integer().optional(),
});

module.exports = { createPartSchema, updatePartSchema };