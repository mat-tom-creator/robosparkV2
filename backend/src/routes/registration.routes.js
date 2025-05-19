// src/routes/registration.routes.js
import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate, registrationValidation } from '../middleware/validation.middleware.js';
import * as registrationController from '../controllers/registration.controller.js';

// Create the router object
const router = express.Router();

// Define routes
router.post('/', verifyToken, registrationValidation.create, validate, registrationController.createRegistration);
router.get('/:id', verifyToken, registrationController.getRegistrationById);
router.post('/:id/cancel', verifyToken, registrationController.cancelRegistration);

// Export the router
export default router;