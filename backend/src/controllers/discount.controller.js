import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validate a discount code
export const validateDiscountCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Discount code is required' });
    }
    
    const discount = await prisma.discountCode.findUnique({
      where: { code }
    });
    
    if (!discount || !discount.isActive) {
      return res.status(404).json({ message: 'Invalid or expired discount code' });
    }
    
    // Check if max uses reached
    if (discount.maxUses !== null && discount.currentUses >= discount.maxUses) {
      return res.status(400).json({ message: 'Discount code has reached maximum uses' });
    }
    
    // Check if within date range
    const now = new Date();
    
    if (discount.startDate && discount.startDate > now) {
      return res.status(400).json({ message: 'Discount code is not yet active' });
    }
    
    if (discount.endDate && discount.endDate < now) {
      return res.status(400).json({ message: 'Discount code has expired' });
    }
    
    // Return discount details
    res.status(200).json({
      id: discount.id,
      code: discount.code,
      description: discount.description,
      discountPercentage: discount.discountPercentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
