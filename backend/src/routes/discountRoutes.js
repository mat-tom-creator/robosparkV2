import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Validate a discount code
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Discount code is required' });
    }
    
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });
    
    if (!discountCode) {
      return res.status(404).json({ message: 'Invalid discount code' });
    }
    
    // Check if the code is active
    if (!discountCode.isActive) {
      return res.status(400).json({ message: 'This discount code is no longer active' });
    }
    
    // Check if the code has reached its maximum uses
    if (discountCode.maxUses && discountCode.currentUses >= discountCode.maxUses) {
      return res.status(400).json({ message: 'This discount code has reached its maximum uses' });
    }
    
    // Check if the code is still valid (date range)
    const currentDate = new Date();
    if (discountCode.startDate && new Date(discountCode.startDate) > currentDate) {
      return res.status(400).json({ message: 'This discount code is not yet active' });
    }
    
    if (discountCode.endDate && new Date(discountCode.endDate) < currentDate) {
      return res.status(400).json({ message: 'This discount code has expired' });
    }
    
    // Return the discount details
    res.json({
      code: discountCode.code,
      discount: Number(discountCode.discountPercentage) / 100, // Convert to decimal for frontend
      description: discountCode.description,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error validating discount code', error: error.message });
  }
});

export default router;