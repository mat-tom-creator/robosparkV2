import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create a new registration
router.post('/', async (req, res) => {
  try {
    const {
      parentInfo,
      childInfo,
      emergencyContact,
      selectedCourseId,
      agreedToTerms,
      photoRelease,
      discountCode,
      amountPaid
    } = req.body;
    
    // Generate a confirmation number
    const confirmationNumber = `RB${Math.floor(100000 + Math.random() * 900000)}`;
    
    // First, check if the user exists by email
    let user = await prisma.user.findUnique({
      where: { email: parentInfo.email },
    });
    
    // If not, create a new user
    if (!user) {
      // In a real app, you'd hash the password, but for demo purposes we're creating users without passwords
      user = await prisma.user.create({
        data: {
          email: parentInfo.email,
          passwordHash: 'placeholder_hash', // In a real app, use bcrypt
          firstName: parentInfo.firstName,
          lastName: parentInfo.lastName,
          phone: parentInfo.phone,
          address: parentInfo.address,
          city: parentInfo.city,
          state: parentInfo.state,
          zipCode: parentInfo.zipCode,
        },
      });
    }
    
    // Find the discount code if provided
    let discountCodeId = null;
    if (discountCode) {
      const dbDiscountCode = await prisma.discountCode.findUnique({
        where: { code: discountCode.code },
      });
      
      if (dbDiscountCode) {
        discountCodeId = dbDiscountCode.id;
      }
    }
    
    // Create the registration
    const registration = await prisma.registration.create({
      data: {
        userId: user.id,
        courseId: selectedCourseId,
        childFirstName: childInfo.firstName,
        childLastName: childInfo.lastName,
        childDateOfBirth: new Date(childInfo.dateOfBirth),
        childGradeLevel: childInfo.gradeLevel,
        childAllergies: childInfo.allergies,
        childSpecialNeeds: childInfo.specialNeeds,
        emergencyContactName: emergencyContact.name,
        emergencyContactRelation: emergencyContact.relationship,
        emergencyContactPhone: emergencyContact.phone,
        agreedToTerms,
        photoRelease,
        confirmationNumber,
        paymentStatus: 'completed', // For simplicity, assuming payment is processed
        amountPaid,
        discountCodeId,
      },
      include: {
        course: true,
        user: true,
        discountCode: true,
      },
    });
    
    // If a discount code was applied, increment its usage count
    if (discountCodeId) {
      await prisma.discountCode.update({
        where: { id: discountCodeId },
        data: {
          currentUses: {
            increment: 1,
          },
        },
      });
    }
    
    res.status(201).json({
      confirmationNumber: registration.confirmationNumber,
      courseId: registration.courseId,
      registrationId: registration.id,
      parentEmail: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating registration', error: error.message });
  }
});

export default router;