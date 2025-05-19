import { body, validationResult } from 'express-validator';

// Validation error handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validation rules
export const authValidation = {
  register: [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must include uppercase, lowercase, number and special character'),
  ],
  login: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

// Course validation rules
export const courseValidation = {
  create: [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('minAge').isInt({ min: 4 }).withMessage('Minimum age must be at least 4'),
    body('maxAge').isInt({ min: 4 }).withMessage('Maximum age must be at least 4'),
    body('skillLevel').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid skill level'),
    body('topics').isArray().withMessage('Topics must be an array'),
    body('duration').notEmpty().withMessage('Duration is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('days').isArray().withMessage('Days must be an array'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  ]
};

// Registration validation rules
export const registrationValidation = {
  create: [
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('childFirstName').notEmpty().withMessage('Child first name is required'),
    body('childLastName').notEmpty().withMessage('Child last name is required'),
    body('childDateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('childGradeLevel').notEmpty().withMessage('Child grade level is required'),
    body('emergencyContactName').notEmpty().withMessage('Emergency contact name is required'),
    body('emergencyContactRelation').notEmpty().withMessage('Emergency contact relationship is required'),
    body('emergencyContactPhone').notEmpty().withMessage('Emergency contact phone is required'),
    body('agreedToTerms').isBoolean().withMessage('Agreement to terms is required'),
    body('photoRelease').isBoolean().withMessage('Photo release preference is required')
  ]
};

// Discount validation rules
export const discountValidation = {
  create: [
    body('code').notEmpty().withMessage('Code is required'),
    body('discountPercentage').isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100'),
    body('isActive').isBoolean().withMessage('isActive must be a boolean')
  ]
};

// Contact validation rules
export const contactValidation = {
  create: [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required')
  ]
};

