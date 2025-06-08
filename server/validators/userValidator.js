const Joi = require('joi');

const updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  phone: Joi.string().optional(),
  role: Joi.string().valid('KLIJENT', 'ZAPOSLENIK', 'ADMIN').optional(),
});

module.exports = { updateUserSchema };