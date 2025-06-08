const Joi = require('joi');

const createSupplierSchema = Joi.object({
  name: Joi.string().required(),
  contactName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updateSupplierSchema = Joi.object({
  name: Joi.string().optional(),
  contactName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
});

module.exports = { createSupplierSchema, updateSupplierSchema };