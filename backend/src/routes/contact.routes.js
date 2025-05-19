import express from 'express';
import { validate, contactValidation } from '../middleware/validation.middleware.js';
import * as contactController from '../controllers/contact.controller.js';

const router = express.Router();

// Submit contact message
router.post('/', contactValidation.create, validate, contactController.submitMessage);

export default router;