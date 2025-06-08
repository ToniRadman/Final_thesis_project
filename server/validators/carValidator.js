const Joi = require('joi');

const carSchema = Joi.object({
  make: Joi.string().min(1).required(),
  model: Joi.string().min(1).required(),
  category: Joi.number().integer().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  price: Joi.number().precision(2).required(),
});

module.exports = { carSchema };