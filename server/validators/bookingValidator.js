const Joi = require('joi');

const createBookingSchema = Joi.object({
  carId: Joi.number().integer().optional(),
  bookingType: Joi.string().valid('probna vožnja', 'pregled vozila', 'servis').lowercase().required(),
  date: Joi.date().iso().required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED').required()
});

module.exports = { createBookingSchema, updateStatusSchema };