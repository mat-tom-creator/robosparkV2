import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { validate, courseValidation, discountValidation } from '../middleware/validation.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

// Dashboard stats
router.get('/dashboard/stats', verifyToken, isAdmin, adminController.getDashboardStats);

// User management
router.get('/users', verifyToken, isAdmin, adminController.getUsers);
router.get('/users/:id', verifyToken, isAdmin, adminController.getUserById);
router.post('/users', verifyToken, isAdmin, adminController.createUser);
router.put('/users/:id', verifyToken, isAdmin, adminController.updateUser);
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser);

// Course management
router.get('/courses', verifyToken, isAdmin, adminController.getCourses);
router.get('/courses/:id', verifyToken, isAdmin, adminController.getCourseById);
router.post('/courses', verifyToken, isAdmin, courseValidation.create, validate, adminController.createCourse);
router.put('/courses/:id', verifyToken, isAdmin, adminController.updateCourse);
router.delete('/courses/:id', verifyToken, isAdmin, adminController.deleteCourse);

// Instructor management
router.get('/instructors', verifyToken, isAdmin, adminController.getInstructors);
router.post('/instructors', verifyToken, isAdmin, adminController.createInstructor);
router.put('/instructors/:id', verifyToken, isAdmin, adminController.updateInstructor);
router.delete('/instructors/:id', verifyToken, isAdmin, adminController.deleteInstructor);

// Discount management
router.get('/discounts', verifyToken, isAdmin, adminController.getDiscountCodes);
router.post('/discounts', verifyToken, isAdmin, discountValidation.create, validate, adminController.createDiscountCode);
router.put('/discounts/:id', verifyToken, isAdmin, adminController.updateDiscountCode);
router.delete('/discounts/:id', verifyToken, isAdmin, adminController.deleteDiscountCode);

// Contact messages management
router.get('/contact-messages', verifyToken, isAdmin, adminController.getContactMessages);
router.put('/contact-messages/:id', verifyToken, isAdmin, adminController.updateContactMessageStatus);
router.delete('/contact-messages/:id', verifyToken, isAdmin, adminController.deleteContactMessage);

export default router;