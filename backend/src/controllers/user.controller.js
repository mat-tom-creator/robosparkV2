import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user registrations
export const getUserRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId: req.userId },
      include: {
        course: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format the registrations for the frontend
    const formattedRegistrations = registrations.map(registration => {
      return {
        id: registration.id,
        courseId: registration.courseId,
        childName: `${registration.childFirstName} ${registration.childLastName}`,
        courseName: registration.course.title,
        startDate: registration.course.startDate,
        endDate: registration.course.endDate,
        confirmationNumber: registration.confirmationNumber,
        status: registration.paymentStatus,
        amountPaid: registration.amountPaid
      };
    });

    res.status(200).json(formattedRegistrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};