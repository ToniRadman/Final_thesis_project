const Joi = require('joi');

const carSchema = Joi.object({
  make: Joi.string().required(),
  model: Joi.string().required(),
  category: Joi.string().valid('SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK', 'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET').required(),
  year: Joi.number().integer().min(1990).max(new Date().getFullYear()).required(),
  price: Joi.number().precision(2).required(),
  status: Joi.string().valid('Dostupno', 'Rezervirano', 'Prodano').required(),
  fuel: Joi.string().valid('Benzin', 'Diesel', 'Električni', 'Hibrid').required(),
  km: Joi.number().integer().min(0).required(),
  imagePath: Joi.string().uri().allow('', null).optional(),
});

module.exports = { carSchema };