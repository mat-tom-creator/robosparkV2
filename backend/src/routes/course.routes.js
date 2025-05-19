import express from 'express'
import * as courseController from '../controllers/course.controller.js';

const router = express.Router();

// Get all courses
router.get('/', courseController.getAllCourses);

// Get course by ID
router.get('/:id', courseController.getCourseById);

export default router;