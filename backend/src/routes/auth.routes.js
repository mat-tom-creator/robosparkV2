import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate, authValidation } from '../middleware/validation.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Register a new user
router.post('/register', authValidation.register, validate, authController.register);

// User login
router.post('/login', authValidation.login, validate, authController.login);

// Admin login
router.post('/admin/login', authValidation.login, validate, authController.adminLogin);

// Get user profile
router.get('/profile', verifyToken, authController.getUserProfile);

// Reset password request
router.post('/reset-password-request', authController.resetPasswordRequest);

// Change password
router.put('/change-password', verifyToken, authController.changePassword);

export default router;