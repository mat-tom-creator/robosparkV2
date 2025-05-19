import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Create a new registration
export const createRegistration = async (req, res) => {
  const { courseId, childFirstName, childLastName, childDateOfBirth, childGradeLevel, 
          childAllergies, childSpecialNeeds, emergencyContactName, emergencyContactRelation,
          emergencyContactPhone, agreedToTerms, photoRelease, discountCodeId } = req.body;

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Get the course
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          registrations: true
        }
      });
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      // Check if course is full
      if (course.registrations.length >= course.capacity) {
        throw new Error('Course is full');
      }
      
      // Calculate child age from date of birth
      const dob = new Date(childDateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      // Check if child age is within course range
      if (age < course.minAge || age > course.maxAge) {
        throw new Error(`Child's age must be between ${course.minAge} and ${course.maxAge} years for this course`);
      }
      
      // Generate confirmation number
      const confirmationNumber = `RS-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
      
      // Calculate payment amount
      let amountPaid = course.discountedPrice || course.price;
      
      // Apply discount if provided
      if (discountCodeId) {
        const discount = await prisma.discountCode.findUnique({
          where: { id: discountCodeId }
        });
        
        if (discount && discount.isActive) {
          // Check if max uses exceeded
          if (!discount.maxUses || discount.currentUses < discount.maxUses) {
            // Check if discount is within date range
            const now = new Date();
            const validStart = !discount.startDate || discount.startDate <= now;
            const validEnd = !discount.endDate || discount.endDate >= now;
            
            if (validStart && validEnd) {
              // Apply discount
              const discountAmount = (Number(amountPaid) * Number(discount.discountPercentage)) / 100;
              amountPaid = Number(amountPaid) - discountAmount;
              
              // Update discount usage count
              await prisma.discountCode.update({
                where: { id: discountCodeId },
                data: { currentUses: { increment: 1 } }
              });
            }
          }
        }
      }
      
      // Create registration
      const registration = await prisma.registration.create({
        data: {
          userId: req.userId,
          courseId,
          childFirstName,
          childLastName,
          childDateOfBirth: new Date(childDateOfBirth),
          childGradeLevel,
          childAllergies,
          childSpecialNeeds,
          emergencyContactName,
          emergencyContactRelation,
          emergencyContactPhone,
          agreedToTerms,
          photoRelease,
          confirmationNumber,
          paymentStatus: 'completed',
          amountPaid,
          discountCodeId
        },
        include: {
          course: {
            include: {
              instructor: true
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          discountCode: true
        }
      });
      
      return registration;
    });
    
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await prisma.registration.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: {
        course: {
          include: {
            instructor: true
          }
        },
        discountCode: true
      }
    });
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel registration
export const cancelRegistration = async (req, res) => {
  try {
    // Get the registration
    const registration = await prisma.registration.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Check if already canceled
    if (registration.paymentStatus === 'refunded') {
      return res.status(400).json({ message: 'Registration is already canceled' });
    }
    
    // Update registration status
    const updatedRegistration = await prisma.registration.update({
      where: { id: req.params.id },
      data: {
        paymentStatus: 'refunded'
      }
    });
    
    res.status(200).json({
      id: updatedRegistration.id,
      status: updatedRegistration.paymentStatus,
      message: 'Registration canceled successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
