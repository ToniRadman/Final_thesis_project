const Joi = require('joi');

// Enum vrijednosti iz VehicleCategory
const allowedCategories = [
  'SUV',
  'LIMUZINA',
  'KOMBI',
  'HATCHBACK',
  'KARAVAN',
  'PICKUP',
  'COUPE',
  'KABRIOLET',
];

const createPartSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid(...allowedCategories).required(),
  price: Joi.number().precision(2).required(),
  supplierId: Joi.number().integer().required(),
});

const updatePartSchema = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string().valid(...allowedCategories).optional(),
  price: Joi.number().precision(2).optional(),
  supplierId: Joi.number().integer().optional(),
});

module.exports = { createPartSchema, updatePartSchema };