const Joi = require('joi');

const createBookingSchema = Joi.object({
  carId: Joi.number().integer().optional(),
  type: Joi.string().valid('probna vožnja', 'pregled vozila', 'servis').required(),
  date: Joi.date().iso().required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED').required()
});

module.exports = { createBookingSchema, updateStatusSchema };