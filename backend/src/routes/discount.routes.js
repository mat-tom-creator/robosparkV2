import express from 'express';
import * as discountController from '../controllers/discount.controller.js';

const router = express.Router();

// Validate discount code
router.post('/validate', discountController.validateDiscountCode);

export default router;