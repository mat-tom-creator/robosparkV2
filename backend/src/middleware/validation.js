// src/middleware/validation.js
const Joi = require('joi');

const courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  longDescription: Joi.string(),
  minAge: Joi.number().integer().min(3).max(18).required(),
  maxAge: Joi.number().integer().min(3).max(18).required(),
  skillLevel: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
  topics: Joi.array().items(Joi.string()).required(),
  duration: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  days: Joi.array().items(Joi.string()).required(),
  timeSlot: Joi.string().required(),
  price: Joi.number().precision(2).positive().required(),
  discountedPrice: Joi.number().precision(2).positive(),
  capacity: Joi.number().integer().positive().required(),
  instructorId: Joi.string().uuid(),
  imageUrl: Joi.string().uri(),
  featured: Joi.boolean(),
});

const registrationSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required(),
  childInfo: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().iso().required(),
    gradeLevel: Joi.string().required(),
    allergies: Joi.string().allow(''),
    specialNeeds: Joi.string().allow(''),
  }).required(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phone: Joi.string().required(),
  }).required(),
  agreedToTerms: Joi.boolean().valid(true).required(),
  photoRelease: Joi.boolean().required(),
  discountCodeId: Joi.string().uuid(),
  amountPaid: Joi.number().precision(2).positive().required(),
});

const validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateRegistration = (req, res, next) => {
  const { error } = registrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCourse,
  validateRegistration,
};