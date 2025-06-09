const Joi = require('joi');

const carSchema = Joi.object({
  make: Joi.string().required(),
  model: Joi.string().required(),
  category: Joi.number().integer().required(),
  year: Joi.number().integer().min(1990).max(new Date().getFullYear()).required(),
  price: Joi.number().precision(2).required(),
  status: Joi.string().valid('Dostupno', 'Rezervirano', 'Prodano').required(),
  fuel: Joi.string().valid('Benzin', 'Dizel', 'Električni', 'Hibrid').required(),
  km: Joi.number().integer().min(0).required(),
  image: Joi.string().uri().required(),
  isNew: Joi.boolean().required(),
});

module.exports = { carSchema };