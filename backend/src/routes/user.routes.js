import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

// Update user profile
router.put('/profile', verifyToken, userController.updateProfile);

// Get user registrations
router.get('/registrations', verifyToken, userController.getUserRegistrations);

export default router;

